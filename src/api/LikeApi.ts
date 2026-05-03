import api from "./axiosConfig";

export const toggleLike = async (postId: number) => {
    return await api.post(`/post/${postId}/like`, {});
};

export const getLikeSummary = async (postId: number) => {
    return await api.get(`/post/${postId}/like/summary`);
};
