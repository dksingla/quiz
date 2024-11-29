import { useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from 'material-react-table';

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
  answers: Array<string>; // Assuming each answer is a string (just the answer text)
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
        const url = `http://localhost:4000/quizzes/5?start=${pagination.pageIndex * pagination.pageSize}&size=${pagination.pageSize}&filters=${JSON.stringify(
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
    ],
    [],
  );

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
