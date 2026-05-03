import api from "./axiosConfig";

export interface ManageSettings {
  fileExtension: string;
  fileMaxSize: number; // byte
  fileCount: number;
}

// PUT - 관리 설정 업데이트
export const updateManageSettings = async (data: ManageSettings) => {
  const response = await api.put("/manage/fileSetting", data);
  return response.data;
};

export const getManageSettings = async (): Promise<ManageSettings> => {
  const response = await api.get("/manage/fileSetting");
  return response.data as any;
};