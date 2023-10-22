import { chats } from '@/ProChat/mocks/threebody';
import { ProChat } from '@ant-design/pro-chat';
import { useTheme } from 'antd-style';

export default () => {
  const theme = useTheme();

  return (
    <div style={{ background: theme.colorBgLayout }}>
      <ProChat
        showTitle
        userMeta={{ avatar: '🧔', title: '罗辑' }}
        assistantMeta={{ avatar: '🛸', title: '三体世界', backgroundColor: 'blue' }}
        initialChats={chats.chats}
      />
    </div>
  );
};
