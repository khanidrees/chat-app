import { useState, useEffect, useRef, useCallback } from "react"
import { Input } from "./ui/input"
import { UserList } from "./UserList"
import { Search } from "lucide-react"
import { useDebounce } from "../hooks/use-debounce"
import type { User } from "../types/user"
 import { getUsers } from "@/apis"

export function UserSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const searchUsers = useCallback(async (query: string) => {
    if (!query.trim()) {
      setUsers([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new AbortController
    abortControllerRef.current = new AbortController()
    const { signal } = abortControllerRef.current

    try {
      // Replace with your actual API endpoint
      const response = await getUsers(query, signal);

      if (!response.data.data) {
        throw new Error("Failed to fetch users")
      }

      console.log(response);
      setUsers(response.data.data);
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError("An error occurred while searching for users")
        console.error(err)
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false)
      }
    }
  }, [])


  useEffect(() => {
    searchUsers(debouncedSearchTerm)

    // Cleanup function to abort any pending requests when component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [debouncedSearchTerm, searchUsers])

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users by name or username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <UserList users={users} loading={loading} error={error} />
    </div>
  )
}

