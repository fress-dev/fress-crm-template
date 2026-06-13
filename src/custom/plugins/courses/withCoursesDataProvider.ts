import type {
  CreateParams,
  DataProvider,
  Identifier,
  RaRecord,
  UpdateParams,
} from "ra-core";

import type { CrmDataProvider } from "@/components/atomic-crm/providers/types";
import { applyFullTextSearch } from "@/custom/providers/applyFullTextSearch";

import type { Course, CourseStore } from "./types";

export const COURSE_SEARCH_COLUMNS = [
  "name",
  "description",
  "course_type",
  "service_kind",
] as const;

const COURSE_STORES_RESOURCE = "course_stores";
type CourseFormData = Partial<Course> & { store_ids?: Identifier[] };

const splitCourseData = <T extends CourseFormData>(data: T) => {
  const { store_ids: storeIds, ...courseData } = data;
  return { courseData, storeIds: storeIds ?? [] };
};

const getCourseStoreIds = async (
  dataProvider: DataProvider,
  courseId: Identifier,
): Promise<Identifier[]> => {
  const { data } = await dataProvider.getList<CourseStore>(
    COURSE_STORES_RESOURCE,
    {
      pagination: { page: 1, perPage: 500 },
      sort: { field: "id", order: "ASC" },
      filter: { course_id: courseId },
    },
  );
  return data.map((record) => record.store_id);
};

const replaceCourseStores = async (
  dataProvider: DataProvider,
  courseId: Identifier,
  nextStoreIds: Identifier[],
): Promise<void> => {
  const { data: currentRows } = await dataProvider.getList<CourseStore>(
    COURSE_STORES_RESOURCE,
    {
      pagination: { page: 1, perPage: 500 },
      sort: { field: "id", order: "ASC" },
      filter: { course_id: courseId },
    },
  );
  const nextIds = new Set(nextStoreIds.map(String));
  const currentIds = new Set(currentRows.map((row) => String(row.store_id)));
  for (const row of currentRows) {
    if (!nextIds.has(String(row.store_id))) {
      await dataProvider.delete(COURSE_STORES_RESOURCE, {
        id: row.id,
        previousData: row,
      });
    }
  }
  for (const storeId of nextStoreIds) {
    if (!currentIds.has(String(storeId))) {
      await dataProvider.create(COURSE_STORES_RESOURCE, {
        data: { course_id: courseId, store_id: storeId },
      });
    }
  }
};

const withCourseStoreIds = async <RecordType extends RaRecord = Course>(
  dataProvider: DataProvider,
  record: RecordType,
): Promise<RecordType & { store_ids: Identifier[] }> => ({
  ...record,
  store_ids: await getCourseStoreIds(dataProvider, record.id),
});

/** courses リソースの検索と course_stores 保存を扱う */
export const withCoursesDataProvider = (
  dataProvider: CrmDataProvider,
): CrmDataProvider => {
  const getList = dataProvider.getList.bind(dataProvider);
  const getOne = dataProvider.getOne.bind(dataProvider);
  const create = dataProvider.create.bind(dataProvider);
  const update = dataProvider.update.bind(dataProvider);

  return {
    ...dataProvider,
    getList: (resource, params, ...rest) => {
      if (resource !== "courses") return getList(resource, params, ...rest);
      const withSearch = applyFullTextSearch([...COURSE_SEARCH_COLUMNS])(
        params,
      );
      return getList(resource, withSearch, ...rest);
    },
    getOne: async (resource, params, ...rest) => {
      const result = await getOne(resource, params, ...rest);
      if (resource !== "courses") return result;
      return {
        ...result,
        data: await withCourseStoreIds(dataProvider, result.data),
      };
    },
    create: async (resource, params: CreateParams, ...rest) => {
      if (resource !== "courses") return create(resource, params, ...rest);
      const { courseData, storeIds } = splitCourseData(params.data);
      const result = await create(
        resource,
        { ...params, data: courseData },
        ...rest,
      );
      await replaceCourseStores(dataProvider, result.data.id, storeIds);
      return { ...result, data: { ...result.data, store_ids: storeIds } };
    },
    update: async (resource, params: UpdateParams, ...rest) => {
      if (resource !== "courses") return update(resource, params, ...rest);
      const { courseData, storeIds } = splitCourseData(params.data);
      const previousData = params.previousData
        ? splitCourseData(params.previousData as CourseFormData).courseData
        : params.previousData;
      const result = await update(
        resource,
        { ...params, data: courseData, previousData },
        ...rest,
      );
      await replaceCourseStores(dataProvider, result.data.id, storeIds);
      return { ...result, data: { ...result.data, store_ids: storeIds } };
    },
  };
};
