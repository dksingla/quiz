import { useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from 'material-react-table';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, Tooltip } from '@mui/material';

type Quiz = {
  quizTitle: string;
  quizSynopsis: string;
  questions: Array<Question>;
};

type Question = {
  id: string; // Unique identifier for each question
  question: string;
  answers: Array<string>;
};

const Example = () => {
  const [data, setData] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading(true);

      try {
        const url = `http://localhost:4000/quizzes/236253?start=${pagination.pageIndex * pagination.pageSize}&size=${pagination.pageSize}&filters=${JSON.stringify(
          columnFilters ?? [],
        )}&globalFilter=${globalFilter ?? ''}&sorting=${JSON.stringify(sorting ?? [])}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const json = await response.json();
        setData([json.data]);  // Assuming the data is structured as a list of quizzes
        setRowCount(json.meta.totalRowCount);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
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

  // Table columns definition
  const columns = useMemo<MRT_ColumnDef<Question>[]>(
    () => [
      {
        id: 'actions', // Column for action buttons like Delete
        header: 'Actions',
        Cell: ({ row }) => (
          <Tooltip title="Delete">
            <IconButton
              color="error"
              onClick={() => handleDeleteRow(row.index, row.original.id)} // Delete the question based on its ID
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ),
      },
      {
        accessorKey: 'question', // Display the question text
        header: 'Question',
      },
      {
        accessorKey: 'answers',
        header: 'Answer 1',
        Cell: ({ row }) => <span>{row.original.answers[0]}</span>,
      },
      {
        accessorKey: 'answers',
        header: 'Answer 2',
        Cell: ({ row }) => <span>{row.original.answers[1]}</span>,
      },
      {
        accessorKey: 'answers',
        header: 'Answer 3',
        Cell: ({ row }) => <span>{row.original.answers[2]}</span>,
      },
      {
        accessorKey: 'answers',
        header: 'Answer 4',
        Cell: ({ row }) => <span>{row.original.answers[3]}</span>,
      },
    ],
    []
  );

  // Handle row deletion (delete a question by its ID)
  const handleDeleteRow = async (rowIndex: number, questionId: string) => {
    try {
      console.log(questionId);
      const response = await fetch(`http://localhost:4000/questions/236253/${questionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete question');
      }

      // On successful deletion, remove the question from state
      const updatedData = [...data];
      updatedData[0].questions = updatedData[0].questions.filter(
        (question) => question.id !== questionId
      );
      setData(updatedData);
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  return (
    <Box>
      <MaterialReactTable
        columns={columns}
        data={data.flatMap((quiz) => quiz.questions)} // Flatten the questions array to display in the table
        // isLoading={isLoading}
        manualPagination
        manualFiltering
        manualSorting
        rowCount={rowCount}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
        onColumnFiltersChange={setColumnFilters}
        onGlobalFilterChange={setGlobalFilter}
        state={{
          columnFilters,
          globalFilter,
          isLoading,
          pagination,
          sorting,
        }}
      />
    </Box>
  );
};

export default Example;
