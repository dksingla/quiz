import { useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from 'material-react-table';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, FormControl, FormControlLabel, FormLabel, IconButton, Radio, RadioGroup, Tooltip } from '@mui/material';
import { useParams } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';

type Quiz = {
  quizId: number;
  quizTitle: string;
  quizSynopsis: string;
  questions: Array<Question>;
};

type Question = {
  questionId: number;
  question: string;
  answers: Array<string>;
  correctAnswer: string;  // Correct answer is now a string (the text of the correct answer)
};

const Example = () => {
  const { quizId } = useParams();
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

  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editedQuestionText, setEditedQuestionText] = useState<string>('');
  const [editedAnswers, setEditedAnswers] = useState<string[]>(['', '', '', '']);

  // Fetch data for the table
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const url = `http://localhost:4000/quizzes/${quizId}?start=${pagination.pageIndex * pagination.pageSize}&size=${pagination.pageSize}&filters=${JSON.stringify(
          columnFilters ?? [],
        )}&globalFilter=${globalFilter ?? ''}&sorting=${JSON.stringify(sorting ?? [])}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const json = await response.json();
        const quizData = json.data;
        const mappedData = {
          ...quizData,
          questions: quizData.questions.map((question: Question) => ({
            questionId: question.questionId, // Map backend `questionId` to `id`
            question: question.question,
            answers: question.answers,
            correctAnswer: question.correctAnswer,
          })),
        };

        setData([mappedData]);
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
        id: 'actions',
        header: 'Actions',
        Cell: ({ row }) => (
          <Box display="flex" justifyContent="center" alignItems="center">
            <Tooltip title="Edit">
              <IconButton
                color="primary"
                onClick={() => handleEditRow(row.original)} // Pass the question data for editing
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                color="error"
                onClick={() => handleDeleteRow(row.index, row.original.questionId)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
      {
        accessorKey: 'correctAnswer',
        header: 'Correct Answer',
        Cell: ({ row }) => {
          return <span>{row.original.correctAnswer}</span>;  // Directly display the correct answer (text)
        },
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
  const handleDeleteRow = async (rowIndex: number, questionId: number) => {
    try {
      const response = await fetch(`http://localhost:4000/questions/${quizId}/${questionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete question');
      }

      // Remove the question from state immediately after deletion
      setData((prevData) => {
        const updatedData = [...prevData];
        updatedData[0].questions = updatedData[0].questions.filter(
          (question) => question.questionId !== questionId
        );
        return updatedData;
      });

      setRowCount((prevRowCount) => prevRowCount - 1); // Decrement row count
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  // Handle row edit
  const handleEditRow = (question: Question) => {
    setEditingQuestion(question);
    setEditedQuestionText(question.question);
    setEditedAnswers(question.answers);
  };

  // Save the updated question
  const handleSaveEdit = async () => {
    if (editingQuestion) {
      try {
        const updatedQuestion = {
          ...editingQuestion,
          question: editedQuestionText,
          answers: editedAnswers,
          correctAnswerText: editingQuestion.correctAnswer, // Send the correct answer text
        };

        const response = await fetch(`http://localhost:4000/questions/${quizId}/${editingQuestion.questionId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedQuestion),
        });

        if (!response.ok) {
          throw new Error('Failed to update question');
        }

        setData((prevData) => {
          const updatedData = [...prevData];
          const questionIndex = updatedData[0].questions.findIndex(
            (q) => q.questionId === editingQuestion.questionId
          );
          updatedData[0].questions[questionIndex] = updatedQuestion;
          return updatedData;
        });

        setEditingQuestion(null);
        setEditedQuestionText('');
        setEditedAnswers(['', '', '', '']);
      } catch (error) {
        console.error('Error updating question:', error);
      }
    }
  };



  // Close the edit dialog without saving
  const handleCloseEditDialog = () => {
    setEditingQuestion(null);
    setEditedQuestionText('');
    setEditedAnswers(['', '', '', '']);
  };

  return (
    <Box>
      {/* Table */}
      <MaterialReactTable
        columns={columns}
        data={data.flatMap((quiz) => quiz.questions)} // Flatten the questions array to display in the table
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

      {/* Dialog Box for Edit */}
      {editingQuestion && (
        // Inside your Dialog (Edit Question) component:
        <Dialog open={true} onClose={handleCloseEditDialog}>
          <DialogTitle>Edit Question</DialogTitle>
          <DialogContent>
            <TextField
              label="Question"
              fullWidth
              value={editedQuestionText}
              onChange={(e) => setEditedQuestionText(e.target.value)}
              margin="normal"
            />

            {/* Answers Inputs */}
            {editedAnswers.map((answer, index) => (
              <TextField
                key={index}
                label={`Answer ${index + 1}`}
                fullWidth
                value={editedAnswers[index]}
                onChange={(e) => {
                  const newAnswers = [...editedAnswers];
                  newAnswers[index] = e.target.value;
                  setEditedAnswers(newAnswers);
                }}
                margin="normal"
              />
            ))}

            {/* Correct Answer Selection */}
            <FormControl component="fieldset" margin="normal">
              <FormLabel component="legend">Correct Answer</FormLabel>
              <RadioGroup
                value={editingQuestion.correctAnswer}  // The actual answer text
                onChange={(e) => setEditingQuestion({
                  ...editingQuestion,
                  correctAnswer: e.target.value,  // Update with the selected answer text
                })}
              >
                {editedAnswers.map((answer, index) => (
                  <FormControlLabel
                    key={index}
                    value={answer}  // Use the answer text as the value
                    control={<Radio />}
                    label={`Answer ${index + 1}`}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

      )}
    </Box>
  );
};

export default Example;
