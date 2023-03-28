import {use} from '@stated-library/react';
import React, {useCallback, useRef, useState} from 'react';
import {LayoutChangeEvent, StyleSheet} from 'react-native';
import {IconButton, Menu, Surface, Text} from 'react-native-paper';
import userLib from '../state/users';
import {PRESSABLE_DIMENSION, SPACING} from '../theme';

const styles = StyleSheet.create({
  surface: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

const Header = () => {
  // user state
  const {users, selectedUserId} = use(userLib.state$);

  // menu state handling
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = useCallback(() => {
    setMenuOpen(prevState => !prevState);
  }, []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // menu anchor
  const anchor = useRef({x: 0, y: 0});
  const handleButtonLayout = useCallback((event: LayoutChangeEvent) => {
    const {layout} = event.nativeEvent;
    anchor.current.x = layout.width;
    anchor.current.y = layout.height;
  }, []);

  return (
    <Surface elevation={1} style={styles.surface}>
      <IconButton
        onLayout={handleButtonLayout}
        icon={'menu'}
        size={PRESSABLE_DIMENSION}
        onPress={toggleMenu}
        accessibilityLabel={'Display available users'}
        accessibilityRole={'button'}
      />
      <Menu visible={menuOpen} onDismiss={closeMenu} anchor={anchor.current}>
        {users.map(user => {
          const selected = user.id === selectedUserId;
          return (
            <Menu.Item
              key={user.id}
              onPress={() => {
                userLib.selectUser(user.id);
                closeMenu();
              }}
              title={user.firstName}
              accessibilityLabel={`View ${user.firstName} data`}
              accessibilityState={{
                selected,
              }}
            />
          );
        })}
      </Menu>
      <Text variant={'headlineMedium'} style={{paddingRight: SPACING}}>
        {users.find(({id}) => id === selectedUserId)?.firstName}
      </Text>
    </Surface>
  );
};

export default Header;
