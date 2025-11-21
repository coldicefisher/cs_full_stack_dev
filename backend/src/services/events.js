import { v4 as uuidv4 } from 'uuid'
import { Event } from '../db/models/event.js'
export async function trackEvent({
  postId,
  action,
  session = uuidv4(),
  date = Date.now(),
}) {
  const event = new Event({ post: postId, action, session, date })
  return await event.save()
}

export async function getTotalViews(postId) {
  return {
    views: await Event.countDocuments({ post: postId, action: 'startView' }),
  }
}

export async function getDailyViews(postId) {
  return await Event.aggregate([
    {
      $match: {
        post: postId,
        action: 'startView',
      },
    },
    {
      $group: {
        _id: {
          $dateTrunc: { date: '$date', unit: 'day' },
        },
        views: { $count: {} },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ])
}

export async function getDailyDurations(postId) {
  return await Event.aggregate([
    // Only this post
    { $match: { post: postId } },

    // Compute startDate/endDate per session using sentinels
    {
      $group: {
        _id: '$session',
        startDate: {
          $min: {
            $cond: [
              { $eq: ['$action', 'startView'] },
              '$date',
              new Date(8640000000000000), // max Date sentinel
            ],
          },
        },
        endDate: {
          $max: {
            $cond: [
              { $eq: ['$action', 'endView'] },
              '$date',
              new Date(0), // epoch sentinel
            ],
          },
        },
      },
    },

    // Clean up sentinels and compute duration (drop incomplete)
    {
      $project: {
        _id: 0,
        startDate: {
          $cond: [
            { $eq: ['$startDate', new Date(8640000000000000)] },
            null,
            '$startDate',
          ],
        },
        endDate: {
          $cond: [{ $eq: ['$endDate', new Date(0)] }, null, '$endDate'],
        },
        duration: {
          $cond: [
            {
              $and: [
                { $ne: ['$startDate', new Date(8640000000000000)] },
                { $ne: ['$endDate', new Date(0)] },
              ],
            },
            { $subtract: ['$endDate', '$startDate'] },
            null,
          ],
        },
      },
    },
    { $match: { duration: { $ne: null } } },

    // Truncate to day and average
    {
      $group: {
        _id: {
          $dateTrunc: { date: '$startDate', unit: 'day' },
        },
        averageDuration: { $avg: '$duration' },
      },
    },
    { $sort: { _id: 1 } },
  ])
}

// export async function getDailyDurations(postId) {
//   return await Event.aggregate([
//     {
//       $match: {
//         post: postId,
//       },
//     },
//     {
//       $project: {
//         session: '$session',
//         startDate: {
//           $cond: [{ $eq: ['$action', 'startView'] }, '$date', undefined],
//         },
//         endDate: {
//           $cond: [{ $eq: ['$action', 'endView'] }, '$date', undefined],
//         },
//       },
//     },
//     {
//       $group: {
//         _id: '$session',
//         startDate: { $first: '$startDate' },
//         endDate: { $first: '$endDate' },
//       },
//     },
//     {
//       $project: {
//         day: { $dateTrunc: { date: '$startDate', unit: 'day' } },
//         duration: { $subtract: ['$endDate', '$startDate'] },
//       },
//     },
//     {
//       $group: {
//         _id: '$day',
//         averageDuration: { $avg: '$duration' },
//       },
//     },
//     {
//       $sort: { _id: 1 },
//     },
//   ])
// }
