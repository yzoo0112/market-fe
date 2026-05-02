import axios from 'axios';

export interface ManageSettings {
  fileExtension: string;
  fileMaxSize: number; // byte
  fileCount: number;
}

// PUT - 관리 설정 업데이트
export const updateManageSettings = async (data: ManageSettings) => {
  
  const token = sessionStorage.getItem('jwt')
  
  const response = await axios.put('/api/manage/fileSetting', data, {
    headers: {
        authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getManageSettings = async (): Promise<ManageSettings> => {
    
    const token = sessionStorage.getItem('jwt')

    const response = await axios.get('/api/manage/fileSetting', {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return response.data as any;
  };