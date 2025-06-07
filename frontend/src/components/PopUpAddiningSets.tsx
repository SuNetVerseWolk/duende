import { useCreateSet } from "@/hooks/useSets";
import { useMemo, useState } from "react";
import { Sets } from "../../generated/prisma";

export default function PopUpAddingSets({
  onSuccess,
  onClose,
}: {
  onSuccess?: () => void;
  onClose?: () => void;
}) {
  const defaultData = useMemo(() => ({ privacy: true } as Sets), []);
  const [data, setData] = useState<Sets>(defaultData);
  const { mutate, isPending } = useCreateSet();

  const handleSubmit = () => {
    mutate(data, {
      onSuccess: () => {
        setData(defaultData);
        onSuccess?.();
        onClose?.();
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="relative p-5 bg-gray-900 border border-gray-700 rounded-lg text-white shadow-lg w-80">
      <h2 className="text-xl font-bold mb-4">Create New Set</h2>
      
      <div className="mb-4">
        <label htmlFor="set-name" className="block text-sm font-medium mb-1">
          Set Name
        </label>
        <input
          id="set-name"
          className="w-full px-4 py-2 text-white bg-gray-800 border border-gray-600 rounded
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none
                     transition-colors duration-300"
          type="text"
          placeholder="Enter set name"
          value={data.name || ""}
          onChange={(e) => setData((prev) => ({ ...prev!, name: e.target.value }))}
          onKeyDown={handleKeyDown}
          disabled={isPending}
          autoFocus
        />
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">Privacy Settings</h3>
        
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              checked={data.privacy === true}
              onChange={() => setData((prev) => ({ ...prev!, privacy: true }))}
              disabled={isPending}
            />
            <span>Private</span>
          </label>
          
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              checked={data.privacy === false}
              onChange={() => setData((prev) => ({ ...prev!, privacy: false }))}
              disabled={isPending}
            />
            <span>Public</span>
          </label>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          className="flex-1 py-2 font-medium text-gray-200 bg-gray-700 hover:bg-gray-600 
                     transition-colors rounded focus:outline-none focus:ring-2 focus:ring-gray-500 
                     focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
          onClick={onClose}
          disabled={isPending}
        >
          Cancel
        </button>
        
        <button
          className="flex-1 py-2 font-medium text-white bg-blue-600 hover:bg-blue-700 
                     transition-colors rounded focus:outline-none focus:ring-2 focus:ring-blue-500 
                     focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
          disabled={isPending || !data.name}
          onClick={handleSubmit}
        >
          {isPending ? "Creating..." : "Create"}
        </button>
      </div>
    </div>
  );
}