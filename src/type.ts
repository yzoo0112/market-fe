export type User = {
  loginId: string;
  password: string;
  nickname: string;
  userName: string;
  phoneNum: string;
  birth: string;
  email: string;
  addr: string;
}

export type LoginUser = {
  loginId: string;
  password: string;
}
export interface PostForm {

  title: string;
  hashtag: string;
  content: string;
  files: File[];
}

//게시글
export type Post = {
  postId: number;
  userId: number;
  title: string;
  content: string;
  createAt: Date;
  updateAt?: Date;
  views: number;
  hashtag: string;
  fileList: PostFile[];
  likeCount: number;
  nickname: string;
  deleted: boolean
}

// 첨부파일
export type PostFile = {
  fileId: number;
  post: number;
  fileName: string;
  fileUrl: string;
  fileOrgname: string;
  imageYn: string;
  fileSize: number;
};


// 댓글
export type Comment = {
  commentId: number;
  postId: number;
  userId: number;
  nickname?: string;
  comment: string;
  createdAt: Date;
  updatedAt?: Date;
}

// 댓글 작성자 정보
export type ComUserInfo = {
  //유저 생성번호
  userId: number;
  nickname: string;
  loginId: string;
  role: string;
}

// 댓글 삭제용
export type DComment = {
  commentId: number;
  postId: number;
}

// 댓글 생성용
export type CommentCreateRequest = {
  postId: number;
  userId: number;
  comment: string;
  nickname: string;
};

//댓글 수정용
export type UpdateCommentLoad = {
  commentId: number;
  postId: number;
  comment: string;
  loginId?: string;
}

//휴지통
export type TrashPost = {
  postId: number;
  title: string;
  nickname: string;
  createAt: string;
  deleted: boolean;
};
//방문자수
export type RawVisit = {
  visit_date: string;
  visits: number;
};

export type VisitData = {
  daily: { date: string; count: number }[];
  monthly: { month: string; count: number }[];
};

// 게시글 목록 조회용 (ViewPost)
export type ViewPost = {
  postId: number;
  title: string;
  contents?: string;
  nickname: string;
  views: number;
  create_at: string;
  update_at: string;
  hashtag?: string[];
  deleted: boolean;
};
