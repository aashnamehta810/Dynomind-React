import { ANY_OBJECT } from '@app/interfaces/interfaces';
import Pusher from 'pusher-js';
import * as PusherPushNotifications from '@pusher/push-notifications-web';
import { useEffect } from 'react';

export const usePusher = (): void => {
  const iOS = () => {
    return (
      ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform) ||
      (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
    );
  };

  useEffect(() => {
    const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY as string, {
      cluster: process.env.REACT_APP_PUSHER_CLUSTER as string,
    });
    const channel = pusher.subscribe(process.env.REACT_APP_PUSHER_PROJECT as string);

    channel.bind('update-translation', function (data: ANY_OBJECT) {
      location.reload();
      return data;
    });

    if (!iOS()) {
      const beamsClient: PusherPushNotifications.Client = new PusherPushNotifications.Client({
        instanceId: process.env.REACT_APP_PUSHER_INSTANCE_ID as string,
      });

      beamsClient
        .start()
        .then(() => beamsClient.clearDeviceInterests())
        .then(() => beamsClient.addDeviceInterest('update-translation'))
        .then(() => beamsClient.getDeviceInterests())
        // eslint-disable-next-line no-console
        .then((interests) => console.log('Current interests:', interests))
        // eslint-disable-next-line no-console
        .catch(console.error);
    }
  }, []);
};
