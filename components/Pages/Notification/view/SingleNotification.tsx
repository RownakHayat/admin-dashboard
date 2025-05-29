"use client"
import { useGetSingleNotificationDataQuery } from '@/store/features/notification';
import { useParams } from 'next/navigation';
import React, { useState } from 'react'
import ProgramView from './ProgramView';
import NotificationEventView from './NotificationEventView';
import NotificationSelectEvent from './NotificationSelectEvent';
import NotificationApplyEvent from './NotificationApplyEvent';
import NotificationPaymentEvent from './NotificationPaymentEvent';

const SingleNotification = () => {
  const params = useParams();
  const id = params.id as string;

  const { data: notificationData, refetch: refetchData } = useGetSingleNotificationDataQuery(id, {
    skip: id == null || id == undefined,
  });

  return (
    <div>
      <div>
        {
          notificationData?.data?.document_type == 'event' ?
            <>
              <NotificationEventView singleParticipateValues={notificationData} />
            </>
            : notificationData?.data?.document_type == 'program' ?
              <>
                <ProgramView singleParticipateValues={notificationData} />
              </>
              : notificationData?.data?.document_type == 'event_select' ?
                <>
                  <NotificationSelectEvent singleParticipateValues={notificationData} />
                </>
                : notificationData?.data?.document_type == 'apply_event' ?
                  <>
                    <NotificationApplyEvent singleParticipateValues={notificationData} />
                  </>
                  : notificationData?.data?.document_type == 'payment_event' ?
                    <>
                      <NotificationPaymentEvent singleParticipateValues={notificationData} />
                    </>
                    : ''
        }

      </div>

    </div>
  )
}

export default SingleNotification
