import { UserSearch } from "../components/UserSearch"

export default function SearchPage() {
  
  return (
    <div className="container py-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Find Users</h1>
      <UserSearch />
    </div>
  )
}