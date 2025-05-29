"use client"

import FormChatFileUpload from "@/components/common/Form/FormChatFileUpload";
import FormContainer from "@/components/common/Form/FormContainer";
import FormInput from "@/components/common/Form/FormInput";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { chatFormSchema } from "../schemas/chatSchema";
import useToast from "@/components/common/hooks/useToast";
import { useStoreConversationMutation } from "@/store/features/helpDesk";
import { useChatBotSetting } from "@/components/common/hooks/chatBotSetting";


const SmsBox = () => {

  const form = useForm<z.infer<typeof chatFormSchema>>({
    resolver: zodResolver(chatFormSchema),
    defaultValues: {
      message: "",
      conversation_attachments: [],
    },
  })

  const { activity_category_id, receiver_id } = useChatBotSetting();
  

  const [ConverSation] = useStoreConversationMutation()
  const { ToastError } = useToast()

  const [showPicker, setShowPicker] = useState(true);

  const onEmojiClick = (emojiData: EmojiClickData, event: MouseEvent) => {
    const preValue = form.getValues("message")
    form.setValue("message", preValue + emojiData.emoji)
    setShowPicker(false);
  };

  const onSubmitHandler = (values: z.infer<typeof chatFormSchema>) => {

    if (!values.message.trim() && values.conversation_attachments.length === 0) {
      ToastError("Message cannot be empty");
      return;
    }
    const data = { ...values, activity_category_id: activity_category_id, receiver_id: receiver_id }

    
    try {
      ConverSation({
        ...values, 
        activity_category_id: activity_category_id, 
        receiver_id: receiver_id
      })
        .unwrap()
        .then((res) => {
          if (res.code === 200) {
            form.reset()
          }
        })
        .catch((err) => {
          ToastError("Something went wrong please try again after some time")
        })
    } catch (error) { }

  }

  return (
    <div className="bg-[#ebecf0]">
      {
        activity_category_id && <FormContainer
        form={form}
        onSubmit={form.handleSubmit(onSubmitHandler)}
      >
        <div className="flex gap-3 px-5 items-center">
          <div className="flex gap-4 items-center text-[#5D586C]">
            <div className="">
              <Popover>
                <PopoverTrigger><Icons.emoji /></PopoverTrigger>
                <PopoverContent>
                  <EmojiPicker style={{ width: "100%" }} onEmojiClick={onEmojiClick} />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center gap-2 ">
              <FormChatFileUpload
                className="hidden"
                name="conversation_attachments"
              />
            </div>
          </div>
          <div className="flex w-full items-center">
            <FormInput
              className="bg-white px-2 w-full mb-1"
              type="text"
              placeholder="Write a message"
              name="message"
            />
            <Button type="button" onClick={() => onSubmitHandler(form.getValues())} className="ml-11 text-[#7468F0] bg-transparent hover:bg-transparent"><Icons.send /></Button>
          </div>
        </div>
      </FormContainer>
      }
      
    </div>
  );
};

export default SmsBox;
