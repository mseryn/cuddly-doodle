import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  async getTasks() {
    const tasks = await fetch('/api/task')
    return await tasks.json()
  }

  async getTask(taskId: number) {
    const task = await fetch(`/api/task/${taskId}`)
    return await task.json()
  }

  async getUsers() {
    const users = await fetch('/api/user')
    return await users.json()
  }

  async setTaskDone(taskId: number, done: boolean) {
    await fetch(`/api/task/${taskId}/done`, { method: 'POST', body: JSON.stringify({ done }), headers: { 'Content-Type': 'application/json' } })
  }
}
