import { Search, Filter, ChevronDown, ChevronRight } from "lucide-react";

const SearchAndFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  roleFilter,
  setRoleFilter,
  showFilters,
  setShowFilters,
  resetFilters,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center md:justify-start px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          <Filter size={18} className="mr-2" />
          Filters
          {showFilters ? (
            <ChevronDown size={18} className="ml-1" />
          ) : (
            <ChevronRight size={18} className="ml-1" />
          )}
        </button>
      </div>

      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters;