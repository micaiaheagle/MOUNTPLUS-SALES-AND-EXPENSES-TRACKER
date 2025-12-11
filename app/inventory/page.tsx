
export default function InventoryPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-6 bg-white rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
                    <p className="text-2xl font-bold">0</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Low Stock Items</h3>
                    <p className="text-2xl font-bold text-red-600">0</p>
                </div>
            </div>
        </div>
    );
}
