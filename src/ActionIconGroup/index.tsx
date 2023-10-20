import ActionIcon, { ActionIconProps } from '@/ActionIcon';
import Icon from '@/Icon';
import Spotlight from '@/components/Spotlight';

import { Dropdown } from 'antd';
import { MoreHorizontal, type LucideIcon } from 'lucide-react';
import { memo } from 'react';

import { DivProps } from '@/types';

import { useStyles } from './style';

export interface ActionIconGroupItems {
  icon: LucideIcon;
  key: string;
  label: string;
}

export interface ActionEvent {
  item: ActionIconGroupItems;
  key: string;
  keyPath: string[];
}

export interface ActionIconGroupProps extends DivProps {
  /**
   * @description The direction of the icons
   * @default "row"
   */
  direction?: 'row' | 'column';
  /**
   * @description The menu items for the dropdown
   */
  dropdownMenu?: (ActionIconGroupItems | { type: 'divider' })[];
  /**
   * @description The items to be rendered
   * @default []
   */
  items?: ActionIconGroupItems[];
  onActionClick?: (action: ActionEvent) => void;
  /**
   * @description The position of the tooltip relative to the target
   * @enum ["top","left","right","bottom","topLeft","topRight","bottomLeft","bottomRight","leftTop","leftBottom","rightTop","rightBottom"]
   */
  placement?: ActionIconProps['placement'];
  /**
   * @description Whether to add a spotlight background
   * @default true
   */
  spotlight?: boolean;
  /**
   * @description The type of the group
   * @default "block"
   */
  type?: 'ghost' | 'block' | 'pure';
}

const ActionIconGroup = memo<ActionIconGroupProps>(
  ({
    type = 'block',
    items = [],
    placement,
    spotlight = true,
    direction = 'row',
    dropdownMenu = [],
    onActionClick,
    ...props
  }) => {
    const { styles } = useStyles({ direction, type });

    const tooltipsPlacement = placement || (direction === 'column' ? 'right' : 'top');

    return (
      <div className={styles.container} {...props}>
        {spotlight && <Spotlight />}
        {items?.length > 0 &&
          items.map((item) => (
            <ActionIcon
              icon={item.icon}
              key={item.key}
              onClick={
                onActionClick
                  ? () => onActionClick?.({ item, key: item.key, keyPath: [item.key] })
                  : undefined
              }
              placement={tooltipsPlacement}
              size="small"
              title={item.label}
            />
          ))}
        {dropdownMenu?.length > 0 && (
          <Dropdown
            menu={{
              items: dropdownMenu.map((item: any) => {
                if (item.type) return item;
                return {
                  ...item,
                  icon: <Icon icon={item.icon} size="small" />,
                  onClick: onActionClick
                    ? (info: ActionEvent) =>
                        onActionClick({
                          item,
                          key: info.key,
                          keyPath: info.keyPath,
                        })
                    : undefined,
                };
              }),
            }}
            trigger={['click']}
          >
            <ActionIcon
              icon={MoreHorizontal}
              key="more"
              placement={tooltipsPlacement}
              size="small"
            />
          </Dropdown>
        )}
      </div>
    );
  },
);

export default ActionIconGroup;
