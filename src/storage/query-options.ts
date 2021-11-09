import { LooseObject } from '@typings';

export type QueryOptions = {
  fieldsToPopulate?: { path: string; select?: string }[];
  fieldsToSelect?: string;
  sortFields?: string;
  limit?: number;
  skip?: number;
  aggregateFilter?: [
    {
      $lookup: {
        from: string;
        localField: string;
        foreignField: string;
        as: string;
      };
    },
    { $unwind: string },
    { $match: LooseObject }
  ];
};
