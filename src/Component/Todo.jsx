import { useState, useEffect } from 'react';
import { PlusCircle, Pencil, Trash2, CheckCircle, Circle, Bell } from 'lucide-react';
import { addTaskAPI, deleteTaskAPI, getTaskAPI, updateTaskAPI } from '../services/allAPI';

const Todo = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState('');
    const days = ['Mon', 'Tue', 'Wed', 'Thu'];
    const currentDate = new Date();
    const month = currentDate.toLocaleString('default', { month: 'long' });

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await getTaskAPI();
                setTodos(response.data);
            } catch (err) {
                console.error('Error Fetching Tasks:', err);
            }
        };
        fetchTodos();
    }, []);

    // Add task function
    const handleAddTask = async () => {
        if (!newTodo.trim()) return;

        const taskData = { text: newTodo };

        try {
            const response = await addTaskAPI(taskData);

            if (response.status === 201) {
                setTodos((prevTodos) => [...prevTodos, response.data]);
                setNewTodo('');
            }
        } catch (err) {
            console.error('Error adding task', err);
        }
    };

    // Update task function
    const handleUpdateTask = async (id, text, completed) => {
        const updatedData = { text, completed: !completed };

        try {
            const response = await updateTaskAPI(id, updatedData);

            if (response.status === 200) {
                setTodos((prevTodos) =>
                    prevTodos.map((todo) => (todo._id === id ? { ...todo, completed: !todo.completed } : todo))
                );
            }
        } catch (err) {
            console.error('Error updating task', err);
        }
    };

    // Handle editing text input
    const handleEditChange = (e) => {
        setEditingText(e.target.value);
    };

    const handleSaveEdit = async (id) => {
        const updatedData = { text: editingText };

        try {
            await handleUpdateTask(id, editingText, false); // Send updated task text to backend

            // Update state to reflect the change without a page reload
            setTodos((prevTodos) =>
                prevTodos.map((todo) => (todo._id === id ? { ...todo, text: editingText } : todo))
            );

            // Reset editing state
            setEditingId(null);
            setEditingText('');
        } catch (err) {
            console.error('Error saving task', err);
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            const response = await deleteTaskAPI(id);
            if (response.status === 200) {
                setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
            }
        } catch (err) {
            console.error('Error Deleting Task', err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 md:p-6">
          
            <div className="w-full max-w-md bg-white rounded-3xl shadow-lg overflow-hidden">
                <div className="p-6 bg-white">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="text-2xl font-bold">To-Do-List</div>
                        <Bell className="w-6 h-6 text-purple-600" />
                    </div>

                    {/* Add Todo Input */}
                    <div className="flex gap-2 mb-6">
                        <input
                            type="text"
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            placeholder="Add a new task"
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                            onClick={handleAddTask}
                            className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                        >
                            <PlusCircle className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Todo List */}
                    <div className="space-y-4">
                        {todos.map((todo) => (
                            <div
                                key={todo._id}  // Use _id for unique key
                                className={`flex items-center justify-between p-4 rounded-xl border ${
                                    todo.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
                                }`}
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <button
                                        onClick={() => handleUpdateTask(todo._id, todo.text, todo.completed)}
                                        className="text-purple-500 hover:text-purple-600"
                                    >
                                        {todo.completed ? (
                                            <CheckCircle className="w-5 h-5" />
                                        ) : (
                                            <Circle className="w-5 h-5" />
                                        )}
                                    </button>
                                    <div className="flex-1">
                                        {editingId === todo._id ? (
                                            <input
                                                type="text"
                                                value={editingText}
                                                onChange={handleEditChange}
                                                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                            />
                                        ) : (
                                            <p className={`text-sm font-medium ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                                {todo.text}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setEditingId(todo._id);
                                            setEditingText(todo.text);
                                        }}
                                        className="p-1 text-gray-400 hover:text-purple-500 transition-colors"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteTask(todo._id)}
                                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    {editingId === todo._id && (
                                        <button
                                            onClick={() => handleSaveEdit(todo._id)}
                                            className="p-1 text-gray-400 hover:text-green-500 transition-colors"
                                        >
                                            Save
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Todo;
