import SkeletonList from './SkeletonList';

import { useContext } from 'react';

import type { ChatMessage } from '@/types';

import { ConfigProvider } from 'antd';
import { cx } from 'antd-style';
import { ChatItem } from '../ChatItem';
import { ChatItemProps } from '../ChatItem/type';
import { MessageComponent } from './Messages';

export type ChatListProps = {
  chatList: ChatMessage[];
  loadingId?: string;
  loading: boolean;
  className?: string;
  chatItemRenderConfig: ChatItemProps['chatItemRenderConfig'];
  style?: React.CSSProperties;
  chatListItemStyle?: React.CSSProperties;
  chatListItemContentStyle?: React.CSSProperties;
  chatListItemTitleStyle?: React.CSSProperties;
  chatListItemAvatarStyle?: React.CSSProperties;
  chatListItemExtraStyle?: React.CSSProperties;
};

const ChatList: React.FC<ChatListProps> = (props) => {
  const {
    chatItemRenderConfig,
    className,
    loading,
    chatListItemContentStyle,
    chatListItemTitleStyle,
    chatListItemAvatarStyle,
    loadingId,
    chatList,
    style,
  } = props;
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);

  const prefixClass = getPrefixCls('pro-chat');

  if (loading)
    return (
      <div className={cx(`${prefixClass}-list`, className)} {...props}>
        <SkeletonList />
      </div>
    );

  return (
    <div className={cx(`${prefixClass}-list`, className)} style={style}>
      {chatList.map((item) => {
        return (
          <ChatItem
            key={item.id}
            data-id={item.id}
            avatar={
              (item as any).meta || {
                avatar: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
                title: 'Ant Design',
              }
            }
            style={props.chatListItemStyle}
            originData={item}
            loading={loadingId === item.id}
            placement={item.role === 'user' ? 'right' : 'left'}
            time={item.updateAt || item.createAt}
            chatListItemContentStyle={chatListItemContentStyle}
            chatListItemTitleStyle={chatListItemTitleStyle}
            chatItemRenderConfig={chatItemRenderConfig}
            chatListItemAvatarStyle={chatListItemAvatarStyle}
          >
            <MessageComponent {...item} />
          </ChatItem>
        );
      })}
    </div>
  );
};

export default ChatList;