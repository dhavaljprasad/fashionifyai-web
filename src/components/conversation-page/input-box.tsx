"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { SendHorizontal } from "lucide-react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { ConversationData } from "@/app/app/visualizer/[conversation_id]/page";
interface InputBoxProps {
  value: string;
  setValue: (value: string) => void;
  setPooling: Dispatch<SetStateAction<string>>;
  setConversationData: Dispatch<SetStateAction<ConversationData[]>>;
}

export const InputBox = ({
  value,
  setValue,
  setPooling,
  setConversationData,
}: InputBoxProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const params = useParams();
  const conversation_id = params.conversation_id as string;

  const onIterationCall = async () => {
    if (loading) return;
    setConversationData((prev) => [
      ...prev,
      {
        role: "user",
        text: value,
        images: [],
      },
    ]);
    try {
      setValue("");
      setLoading(true);
      const res = await api.post("/api/conversation/visualization/iteration", {
        message: value,
        conversation_id: conversation_id,
      });
      if (res.status == 200) {
        console.log(res.data, "iteration response");
        setPooling(res.data.pooling_id);
      }
    } catch (e) {
      console.log("Unexpected error occured in onIterationCall as: ", e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed bottom-4 z-5 h-14 w-full px-4 sm:px-16">
      <div className="flex h-full w-full items-center justify-center gap-2 bg-white/80 p-2 transition-colors duration-200 focus-within:bg-white">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 bg-transparent text-base sm:text-lg font-semibold text-background-primary outline-none"
        />
        <div
          className="flex aspect-square h-full items-center justify-center bg-accent"
          onClick={() => onIterationCall()}
        >
          <SendHorizontal size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
};
