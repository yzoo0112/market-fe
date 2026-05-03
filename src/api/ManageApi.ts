import api from "./axiosConfig";
import dayjs from "dayjs";
import type { RawVisit, VisitData } from "../type";

export const getVisitCount = async (): Promise<VisitData> => {
  const res = await api.get<RawVisit[]>("/manage/visit");

  const rawData = res.data;

  const daily = rawData.map((item) => ({
    date: item.visit_date,
    count: item.visits,
  }));

  const monthlyMap = new Map<string, number>();
  rawData.forEach(({ visit_date, visits }) => {
    const month = dayjs(visit_date).format("YYYY-MM");
    monthlyMap.set(month, (monthlyMap.get(month) || 0) + visits);
  });

  const monthly = Array.from(monthlyMap.entries()).map(([month, count]) => ({
    month,
    count,
  }));

  return { daily, monthly };
};