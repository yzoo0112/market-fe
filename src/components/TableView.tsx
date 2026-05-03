import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import type { ViewPost } from "../type";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton, MenuItem, Radio, RadioGroup, Select } from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';
import { useSearch } from "../contexts/useSearch";
import { getPosts } from "../api/posts";  // API import
import { useNavigate } from "react-router-dom";
import PostWriteBtn from "./PostWriteBtn";

export default function TableView() {
    const pageSize = 5;

    const [sortKey, setSortKey] = useState<'postId' | 'title' | 'nickname' | 'views' | 'create_at' | 'update_at'>('postId');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [openSortModal, setOpenSortModal] = useState(false);
    const [tempSortKey, setTempSortKey] = useState(sortKey);
    const [tempSortOrder, setTempSortOrder] = useState(sortOrder);
    const { keyword } = useSearch();

    const [page, setPage] = useState(0); // 현재 페이지 (0-based)
    const [posts, setPosts] = useState<ViewPost[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const openSortDialog = () => {
        setTempSortKey(sortKey);
        setTempSortOrder(sortOrder);
        setOpenSortModal(true);
    };

    const applySort = () => {
        setSortKey(tempSortKey);
        setSortOrder(tempSortOrder);
        setOpenSortModal(false);
        setPage(0); // 정렬 바뀌면 페이지 1로 초기화
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    // API 호출 useEffect
    useEffect(() => {
        setLoading(true);
        getPosts({
            page,
            size: pageSize,
            sortKey,
            sortOrder,
            keyword: keyword || undefined,
        })
            .then(({ data, total }) => {
                const filtered = data.filter((post) => !post.deleted);
                setPosts(filtered);
                setTotal(total);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch posts", error);
                setLoading(false);
            });
    }, [page, pageSize, sortKey, sortOrder, keyword]);

    const columns: GridColDef[] = [
        { field: 'postId', headerName: '글 번호', width: 150 },
        { field: 'title', headerName: '제목', width: 250 },
        { field: 'nickname', headerName: '작성자', width: 180 },
        { field: 'views', headerName: '조회수', width: 180 },
        { field: 'create_at', headerName: '작성일', width: 180 },
        { field: 'update_at', headerName: '수정일', width: 180 },
    ];

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const navigate = useNavigate(); //상세페이지로 이동할 때 필요

    return (
        <Box>
            {/* <MainSearch /> */}

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.1}>
                <IconButton onClick={openSortDialog}>
                    <FilterListIcon />
                </IconButton>
            </Box>

            <DataGrid
                rows={posts}
                columns={columns}
                getRowId={(row) => row.postId}
                hideFooter
                loading={loading}
                onRowClick={(params) => navigate(`/post/${params.id}`)} //상세페이지로 이동할 때 필요
                autoHeight
            />

            <Box display="flex" justifyContent="flex-end" p={2} >
                <PostWriteBtn /> {/* 글 작성 버튼 */}
            </Box>

            <Box display="flex" justifyContent="center" mt={2} gap={1}>
                <Button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 0}
                >
                    {"<<"}
                </Button>
                {Array.from({ length: totalPages }, (_, idx) => (
                    <Button
                        key={idx}
                        variant="text"
                        onClick={() => handlePageChange(idx)}
                        sx={{
                            color: page === idx ? 'primary.main' : 'grey.700',
                            fontWeight: page === idx ? 'bold' : 'normal',
                            minWidth: '40px'
                        }}
                    >
                        {idx + 1}
                    </Button>
                ))}
                <Button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages - 1}
                >
                    {">>"}
                </Button>

            </Box>

            <Dialog open={openSortModal} onClose={() => setOpenSortModal(false)}>
                <DialogTitle>정렬 설정</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <Select
                        fullWidth
                        value={tempSortKey}
                        onChange={(e) => setTempSortKey(e.target.value as typeof sortKey)}
                    >
                        <MenuItem value="postId">글 번호</MenuItem>
                        <MenuItem value="title">제목</MenuItem>
                        <MenuItem value="nickname">작성자</MenuItem>
                        <MenuItem value="views">조회수</MenuItem>
                        <MenuItem value="create_at">작성일</MenuItem>
                        <MenuItem value="update_at">수정일</MenuItem>
                    </Select>

                    <RadioGroup
                        value={tempSortOrder}
                        onChange={(e) => setTempSortOrder(e.target.value as typeof sortOrder)}
                        row
                    >
                        <FormControlLabel value="asc" control={<Radio />} label="오름차순" />
                        <FormControlLabel value="desc" control={<Radio />} label="내림차순" />
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenSortModal(false)}>닫기</Button>
                    <Button onClick={applySort} variant="contained">
                        적용
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
