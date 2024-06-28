import BackBottom from '@/BackBottom';
import { createStyles } from 'antd-style';
import RcResizeObserver from 'rc-resize-observer';
import { CSSProperties, memo, useContext, useEffect, useRef, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import { ChatListItemProps } from '@/ChatList/ChatListItem';
import { ProInputArea, ProInputAreaProps } from '@ant-design/pro-chat';
import { ConfigProvider } from 'antd';
import ChatList from '../components/ChatList';
import ChatScrollAnchor from '../components/ScrollAnchor';
import { useStore } from '../store';
import useProChatLocale from '../hooks/useProChatLocale';
import { useOverrideStyles } from './OverrideStyle';
import { ProChatChatReference } from './StoreUpdater';
import { ProChatProps } from './index';

const useStyles = createStyles(
  ({ css, responsive, stylish }) => css`
    overflow: hidden scroll;
    height: 100%;
    ${responsive.mobile} {
      ${stylish.noScrollbar}
      width: 100%;
    }
  `,
);

/**
 * 对话组件的属性接口
 */
export interface ConversationProps extends ProChatProps<any> {
  /**
   * 是否显示标题
   */
  showTitle?: boolean;
  /**
   * 样式对象
   */
  style?: CSSProperties;
  /**
   * CSS类名
   */
  className?: string;
  /**
   * 聊天引用
   */
  chatRef?: ProChatChatReference;
  /**
   * 输入区域的渲染函数
   * @param defaultDom 默认的 DOM 元素
   * @param onMessageSend 发送消息的回调函数
   * @param onClearAllHistory 清除所有历史记录的回调函数
   * @returns 渲染的 React 元素
   */
  inputAreaRender?: ProInputAreaProps['inputAreaRender'];
  /**
   * 输入框的渲染函数
   * @param defaultDom 默认的 DOM 元素
   * @param onMessageSend 发送消息的回调函数
   * @param props 输入框的属性
   */
  inputRender: ProInputAreaProps['inputRender'];

  /**
   * 聊天发送按钮的渲染配置
   * @param defaultDom 默认的 DOM 元素
   * @param defaultProps 默认的属性
   */
  sendButtonRender?: ProInputAreaProps['sendButtonRender'];

  /**
   * 滚动时候的监听方法
   */
  onScroll?: (e: Event) => void;

  renderErrorMessages?: ChatListItemProps['renderErrorMessages'];
}

const App = memo<ConversationProps>(
  ({
    renderInputArea,
    inputAreaRender,
    className,
    style,
    showTitle,
    chatRef,
    itemShouldUpdate,
    inputRender,
    chatItemRenderConfig,
    backToBottomConfig,
    renderErrorMessages,
    sendButtonRender,
    onScroll,
    markdownProps,
  }) => {
    const ref = useRef<HTMLDivElement>(null);
    const areaHtml = useRef<HTMLDivElement>(null);
    const { styles, cx } = useStyles();
    const { styles: override } = useOverrideStyles();
    const [isRender, setIsRender] = useState(false);
    const [height, setHeight] = useState('100%' as string | number);
    const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
    const { localeObject } = useProChatLocale();
    const [sendMessage, isLoading, placeholder, inputAreaProps, clearMessage, stopGenerateMessage] =
    useStore((s) => [
      s.sendMessage,
      !!s.chatLoadingId,
      s.placeholder,
      s.inputAreaProps,
      s.clearMessage,
      s.stopGenerateMessage,
    ]);

    useEffect(() => {
      // 保证 ref 永远存在
      setIsRender(true);
      if (chatRef?.current) {
        chatRef.current.scrollToBottom = () => {
          (ref as any)?.current?.scrollTo({
            behavior: 'smooth',
            left: 0,
            top: ref.current?.scrollHeight || 99999,
          });
        };
      }
    }, []);

    const prefixClass = getPrefixCls('pro-chat');
    return (
      <RcResizeObserver
        onResize={(e) => {
          if (
            typeof height !== typeof e.height ||
            (typeof height === 'string' && typeof e.height === 'string' && e.height !== height) ||
            (typeof height === 'number' && Math.abs(e.height - height) > 1)
          ) {
            // stop shaking
            setHeight(e.height);
          }
        }}
      >
        <Flexbox
          className={cx(override.container, className, `${prefixClass}-container`)}
          style={{
            maxHeight: '100vh',
            height: '100%',
            ...style,
          }}
        >
          <>
            <div
              ref={ref}
              className={cx(`${prefixClass}-chat-list-container`, styles)}
              style={{
                height: (height as number) - (areaHtml.current?.clientHeight || 0) || '100%',
              }}
            >
              <ChatList
                showTitle={showTitle}
                itemShouldUpdate={itemShouldUpdate}
                chatItemRenderConfig={chatItemRenderConfig}
                markdownProps={markdownProps}
                renderErrorMessages={renderErrorMessages}
              />
              {ref?.current && <ChatScrollAnchor target={ref} />}
            </div>
            {isRender && ref?.current ? (
              <BackBottom
                style={{
                  bottom: 138,
                }}
                onScroll={onScroll}
                target={ref}
                text={localeObject.backToBottom}
                {...backToBottomConfig}
              />
            ) : null}
          </>
          {renderInputArea !== null && inputAreaRender !== null && (
            <div ref={areaHtml}>
              {
                <ProInputArea
                  sendButtonRender={sendButtonRender}
                  inputAreaRender={inputAreaRender || renderInputArea}
                  inputRender={inputRender}
                  sendMessage={sendMessage}
                  sendShortcutKey="enter"
                  extra={['image', 'audio']} 
                  stopGenerateMessage={function (): void {
                    throw new Error('Function not implemented.');
                  } } isLoading={false}                />
              }
            </div>
          )}
        </Flexbox>
      </RcResizeObserver>
    );
  },
);

export default App;
