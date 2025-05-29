

import FileShowWithName from '@/components/common/FileShow/FileShowWithName';
import { useChatBotSetting } from '@/components/common/hooks/chatBotSetting';
import { ScrollArea } from '@/components/ui/scroll-area';
import { siteConfig } from '@/config/site';
import { useGetHelpdeskConversationQuery } from '@/store/features/helpDesk';
import { useAuthUserQuery } from '@/store/features/UserManagement/User';
import moment from 'moment';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import MessageLoder from '../MessageLoder/MessageLoder';


const Messages = () => {

    const { activity_category_id, receiver_id } = useChatBotSetting();

    const { data: employeeInfo } = useAuthUserQuery();

    const [params, setParams] = useState({ page: 1, limit: 10, sortBy: "", orderBy: "DESC" });
    const { data: conversations, refetch: refetchMessage, isLoading } = useGetHelpdeskConversationQuery(
        { ...params, activity_category_id: activity_category_id, user_id: receiver_id },
        { refetchOnMountOrArgChange: true }
    );


    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);


    const fileExtension = useCallback((path: string) => {
        const type = path?.split('.').pop()
        return type === "png" || type === "jpg" || type === "jpeg";
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [params, activity_category_id]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    };

    useEffect(() => {
        if (activity_category_id !== null) {
            const intervalId = setInterval(() => {
                refetchMessage();
                scrollToBottom();
            }, 10000);
            return () => clearInterval(intervalId);
        }
    }, [activity_category_id]);


    const handleScroll = () => {
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            if ((scrollContainer.scrollTop === 0) && conversations?.pagination?.total >= params?.limit) {
                setParams(prevParams => ({
                    ...prevParams,
                    limit: prevParams.limit + 10,
                }));
            }
        }
    };

    const convertUrlsToLinks = (text: any) => {
        const urlPattern = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlPattern, (url: any) => {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">${url}</a>`;
        });
    };

    let content: any = ""

    if (isLoading) {
        content = <MessageLoder length={8} />
    } else {
        content = conversations?.data && conversations?.data?.slice().reverse().map((mess: any, idx: number) => {

            const messageWithLinks = convertUrlsToLinks(mess?.message || "");
            return (
                <div key={idx} className='mb-4 mt-3'>
                    <div className="grid grid-cols-12">
                        <div className={`col-span-12 md:col-span-12 ${mess?.sender_id === employeeInfo?.data?.id ? 'float-right' : 'float-left'}`}>
                            <div className={` ${mess?.sender_id === employeeInfo?.data?.id ? 'flex justify-end' : ''}`}>

                                <div className={`${mess?.sender_id === employeeInfo?.data?.id ? 'bg-white' : 'bg-headerbg'}   block p-2 rounded-bl-2xl rounded-tr-2xl rounded-br-2xl w-1/2`}>
                                    {mess?.conversation_attachments?.length > 0 && mess?.conversation_attachments?.map((conv: any, conIdx: number) => (
                                        <div key={conIdx} className='block w-full '>
                                            {fileExtension(conv?.attach_file_path) ? (
                                                <Image
                                                    className="rounded-3xl my-2"
                                                    src={conv?.attach_file_path ? `${siteConfig?.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${conv?.attach_file_path}` : "/assets/images/big-screenlogo.png"}
                                                    alt="Conversation Image"
                                                    width={200}
                                                    height={200}
                                                />
                                            ) : (
                                                <FileShowWithName path={conv?.attach_file_path} />
                                            )}
                                        </div>
                                    ))}
                                    {mess?.message !== "" && (<p className="text-wrap text-[#5D586C] break-words" dangerouslySetInnerHTML={{ __html: messageWithLinks }}></p>)}
                                    <p className="text-[#5D586C] font-light text-[10px] text-right">{moment(mess?.created_at).format('LT')}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-6"></div>
                    </div>
                </div>
            )
        })
    }


    return (
        <div className="mb-0 overflow-y-scroll scrollbar h-[72vh] custom-scrollbar message_scroll" ref={scrollContainerRef} onScroll={handleScroll}>
            <InfiniteScroll
                pageStart={0}
                loadMore={() => { }}
                hasMore={true || false}
            >
                <ScrollArea>
                    {content}
                    <div ref={messagesEndRef}></div>
                </ScrollArea>
            </InfiniteScroll>
        </div>
    );
};

export default Messages;
