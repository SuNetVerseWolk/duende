"use client";

import { useDeleteSet, useSet, useUpdateSet } from "@/hooks/useSets";
import { SetWithCards } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

export default function UserSetItem() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const { data, isLoading: setIsLoading, isPaused } = useSet(id);
  const isLoading = useMemo(
    () => !id || setIsLoading || isPaused,
    [id, setIsLoading, isPaused]
  );

  const updateSetMutation = useUpdateSet();
  const deleteSetMutation = useDeleteSet();

  const [formData, setFormData] = useState<SetWithCards | undefined>(undefined);

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (!prev) return undefined;
      return { ...prev, [name]: value };
    });
  };

  const handleRadioChange = (privacy: boolean) => {
    setFormData(prev => {
      if (!prev) return undefined;
      return { ...prev, privacy };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData?.id) return;

    try {
      await updateSetMutation.mutateAsync({ 
        id: formData.id, 
        data: {
          name: formData.name,
          description: formData.description,
          privacy: formData.privacy
        }
      });

      toast.success("Набор успешно обновлен");
      router.refresh();
    } catch (error) {
      toast.error("Ошибка при обновлении набора");
      console.error("Update error:", error);
    }
  };

  const handleDelete = async () => {
    if (!formData?.id) return;
    if (!confirm("Вы уверены, что хотите удалить этот набор?")) return;

    try {
      await deleteSetMutation.mutateAsync(formData.id);
      toast.success("Набор успешно удален");
      router.push("/sets");
    } catch (error) {
      toast.error("Ошибка при удалении набора");
      console.error("Delete error:", error);
    }
  };

  const isSubmitting = updateSetMutation.isPending;
  const isDeleting = deleteSetMutation.isPending;
  const isDisabled = isLoading || isSubmitting || isDeleting;

  if (isLoading || !formData) {
    return <div className="text-white flex flex-col gap-3 sm:gap-4 bg-white/5 p-4 sm:p-5 md:p-6 rounded-2xl my-4 sm:my-5">Загружается...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="flex flex-col gap-3 sm:gap-4 bg-white/5 p-4 sm:p-5 md:p-6 rounded-2xl my-4 sm:my-5">
        <input
          name="name"
          className="w-full px-3 sm:px-4 py-2 text-white bg-gray-700/90 border border-gray-600 rounded-lg
                    focus:border-white focus:ring-2 focus:ring-white focus:outline-none
                    transition-colors duration-300 placeholder-gray-400 text-sm sm:text-base"
          placeholder={isLoading ? "Загрузка..." : "Название набора"}
          value={formData.name || ""}
          onChange={handleInputChange}
          disabled={isDisabled}
          required
          minLength={2}
          maxLength={100}
        />

        <input
          name="description"
          className="w-full px-3 sm:px-4 py-2 text-white bg-gray-700/90 border border-gray-600 rounded-lg
                    focus:border-white focus:ring-2 focus:ring-white focus:outline-none
                    transition-colors duration-300 placeholder-gray-400 text-sm sm:text-base"
          placeholder={isLoading ? "Загрузка..." : "Описание"}
          value={formData.description || ""}
          onChange={handleInputChange}
          disabled={isDisabled}
          maxLength={500}
        />

        <div className="my-2 sm:my-3 text-white">
          <h3 className="mb-2 text-sm sm:text-base font-medium">
            Выбор приватности
          </h3>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm sm:text-base">
            <div className="flex items-center">
              <input
                type="radio"
                id="closed"
                name="privacy"
                className="h-4 w-4"
                checked={formData.privacy}
                onChange={() => handleRadioChange(false)}
                disabled={isDisabled}
              />
              <label htmlFor="closed" className="ml-2">
                Закрытый
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="radio"
                id="global"
                name="privacy"
                className="h-4 w-4 ml-0 sm:ml-3"
                checked={!formData.privacy}
                onChange={() => handleRadioChange(true)}
                disabled={isDisabled}
              />
              <label htmlFor="global" className="ml-2">
                Глобальный
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-1">
          <button
            type="submit"
            className="text-white font-semibold bg-blue-600 hover:bg-blue-700 
                      transition-colors duration-300 shadow-md focus:outline-none 
                      focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                      py-1.5 sm:py-2 px-4 rounded-sm text-sm sm:text-base flex-1 text-center
                      disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isDisabled}
          >
            {isSubmitting ? "Сохранение..." : "Сохранить"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="text-white font-semibold bg-red-600 hover:bg-red-700 
                      transition-colors duration-300 shadow-md focus:outline-none 
                      focus:ring-2 focus:ring-red-500 focus:ring-offset-2 
                      py-1.5 sm:py-2 px-4 rounded-sm text-sm sm:text-base flex-1 text-center
                      disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isDisabled}
          >
            {isDeleting ? "Удаление..." : "Удалить"}
          </button>
        </div>
      </div>
    </form>
  );
}