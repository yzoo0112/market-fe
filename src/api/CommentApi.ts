import api from "./axiosConfig";
import type { Comment, CommentCreateRequest, DComment, UpdateCommentLoad } from "../type";

// 댓글 수정
export const updateComment = async (CommentData: UpdateCommentLoad): Promise<Comment> => {
    const res = await api.put(`/post/${CommentData.postId}/comment/${CommentData.commentId}`, CommentData);
    return res.data as any;
};

// 댓글 조회
export const getComment = async (postId: number): Promise<Comment[]> => {
    const response = await api.get(`/post/${postId}/comment`);
    return response.data as any;
};

// 댓글 작성
export const createComment = async (CommentData: CommentCreateRequest): Promise<void> => {
    await api.post(`/post/${CommentData.postId}/comment`, CommentData);
};

// 댓글 삭제
export const deleteCommnet = async (CommentData: DComment) => {
    const response = await api.delete(`/post/${CommentData.postId}/comment/${CommentData.commentId}`);
    return response.data;
};
