import api from "./axiosConfig";

// 휴지통 목록 조회
export const getDeletedPosts = () => {
    return api.get("/post/manage/trash");
};

// 복구
export const restorePost = (postId: number) => {
    return api.patch(`/post/manage/${postId}/restore`, {});
};

// 영구삭제
export const permanentlyDeletePost = (postId: number) => {
    return api.delete(`/post/manage/trash/${postId}`);
};
