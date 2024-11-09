import { Injectable } from '@angular/core';
import { Task, User } from '@cuddly-doodle/shared';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  async getTasks(): Promise<Task[]> {
    const tasks = await fetch('/api/task')
    return await tasks.json()
  }

  async getTask(taskId: number): Promise<Task> {
    const task = await fetch(`/api/task/${taskId}`)
    return await task.json()
  }

  async getUsers(): Promise<User[]> {
    const users = await fetch('/api/user')
    return await users.json()
  }

  async setTaskDone(taskId: number, done: boolean) {
    await fetch(`/api/task/${taskId}/done`, { method: 'POST', body: JSON.stringify({ done }), headers: { 'Content-Type': 'application/json' } })
  }
}
