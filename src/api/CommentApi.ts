import axios from "axios";
import type { Comment, CommentCreateRequest, DComment, UpdateCommentLoad } from "../type";

//댓글 수정
export const updateComment = async (CommentData: UpdateCommentLoad): Promise<Comment> => {
    const token = sessionStorage.getItem("jwt")
    const res = await axios.put(`/api/post/${CommentData.postId}/comment/${CommentData.commentId}`, CommentData,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
    return res.data as any;
};

//댓글 조회
export const getComment = async (postId: number): Promise<Comment[]> => {
    const response = await axios
        .get(`/api/post/${postId}/comment`);
    return response.data as any;
};

//댓글 작성
export const createComment = async (CommentData: CommentCreateRequest): Promise<void> => {
    const token = sessionStorage.getItem("jwt");
    await axios.post(`/api/post/${CommentData.postId}/comment`,
        // comment: CommentData.comment,
        // userId: CommentData.userId, // 세션스토리지에서 꺼낸 값
        CommentData,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );

}

//댓글 삭제
export const deleteCommnet = async (CommentData: DComment) => {
    const token = sessionStorage.getItem("jwt");
    const response =
        await axios.delete(`/api/post/${CommentData.postId}/comment/${CommentData.commentId}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        )
    return response.data;
}

