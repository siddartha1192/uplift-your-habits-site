
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, ListCheck, X } from "lucide-react";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

const TodoListCard: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodoText, setNewTodoText] = useState("");

  const addTodo = () => {
    if (newTodoText.trim()) {
      setTodos([
        ...todos,
        {
          id: `todo-${Date.now()}`,
          text: newTodoText.trim(),
          completed: false
        }
      ]);
      setNewTodoText("");
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <ListCheck className="h-5 w-5 text-journal" />
          Todo List
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input 
            placeholder="Add a task..." 
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1"
          />
          <Button 
            onClick={addTodo}
            className="bg-journal hover:bg-journal-dark"
            disabled={!newTodoText.trim()}
          >
            Add
          </Button>
        </div>
        
        <div className="space-y-2">
          {todos.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No tasks yet. Add something to do!
            </p>
          ) : (
            todos.map(todo => (
              <div 
                key={todo.id} 
                className="flex items-center justify-between p-2 border rounded-md group"
              >
                <div 
                  className="flex items-center gap-2 flex-1 cursor-pointer"
                  onClick={() => toggleTodo(todo.id)}
                >
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`h-5 w-5 p-0 rounded-full ${todo.completed ? 'bg-journal text-white' : ''}`}
                  >
                    {todo.completed && <Check className="h-3 w-3" />}
                  </Button>
                  <span className={todo.completed ? 'line-through text-muted-foreground' : ''}>
                    {todo.text}
                  </span>
                </div>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoListCard;
