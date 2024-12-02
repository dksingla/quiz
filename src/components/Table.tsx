import { useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from 'material-react-table';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@mui/material';

type Quiz = {
  quizTitle: string;
  quizSynopsis: string;
  address: string;
  state: string;
  phoneNumber: string;
  questions: Array<Question>;
};

type Question = {
  question: string;
  questionType: string;
  questionPic: string | null;
  answerSelectionType: string;
  answers: Array<string>;
  correctAnswer: string;
  messageForCorrectAnswer: string;
  messageForIncorrectAnswer: string;
  explanation: string;
  point: string;
};

const Example = () => {
  const [data, setData] = useState<Quiz[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!data.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      try {
        const url = `http://localhost:4000/quizzes/236253?start=${pagination.pageIndex * pagination.pageSize}&size=${pagination.pageSize}&filters=${JSON.stringify(
          columnFilters ?? [],
        )}&globalFilter=${globalFilter ?? ''}&sorting=${JSON.stringify(sorting ?? [])}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const json = await response.json();
        setData([json.data]);
        setRowCount(json.meta.totalRowCount);
        setIsError(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
        setIsRefetching(false);
      }
    };

    fetchData();
  }, [
    columnFilters,
    globalFilter,
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
  ]);

  // Table columns
  const columns = useMemo<MRT_ColumnDef<Question>[]>(
    () => [
      {
        id: 'actions', // Unique identifier for the column
        header: 'Actions',
        Cell: ({ row }) => (
          <Tooltip title="Delete">
            <IconButton
              color="error"
              onClick={() => handleDeleteRow(row.index)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ),
      },
      {
        accessorKey: 'question', // Display the question
        header: 'Question',
      },
      {
        accessorKey: 'answers',
        header: 'Answer 1',
        Cell: ({ row }) => <span>{row.original.answers[0]}</span>, // Display the first answer
      },
      {
        accessorKey: 'answers',
        header: 'Answer 2',
        Cell: ({ row }) => <span>{row.original.answers[1]}</span>, // Display the second answer
      },
      {
        accessorKey: 'answers',
        header: 'Answer 3',
        Cell: ({ row }) => <span>{row.original.answers[2]}</span>, // Display the third answer
      },
      {
        accessorKey: 'answers',
        header: 'Answer 4',
        Cell: ({ row }) => <span>{row.original.answers[3]}</span>, // Display the fourth answer
      },
      // Add a new column for the Delete button
      
    ],
    []
  );

  const handleDeleteRow = (rowIndex: number) => {
    // Find the quiz and question to delete by the rowIndex
    const quizIndex = Math.floor(rowIndex / data[0].questions.length);
    const questionIndex = rowIndex % data[0].questions.length;

    const updatedData = [...data];
    updatedData[quizIndex].questions.splice(questionIndex, 1); // Remove the question from the quiz

    if (updatedData[quizIndex].questions.length === 0) {
      updatedData.splice(quizIndex, 1); // If no questions left in the quiz, remove the quiz itself
    }

    setData(updatedData);
  };

  const table = useMaterialReactTable({
    columns,
    data: data.flatMap((quiz) => quiz.questions), // Flatten quiz data to get the questions for each quiz
    enableRowSelection: true,
    getRowId: (row) => row.question, // Use question text as row ID (or some other unique identifier)
    initialState: { showColumnFilters: true },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    muiToolbarAlertBannerProps: isError
      ? {
          color: 'error',
          children: 'Error loading data',
        }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    },
  });

  return <MaterialReactTable table={table} />;
};

export default Example;
