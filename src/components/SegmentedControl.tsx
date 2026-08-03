import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Option<T extends string> = { label: string; value: T };

type Props<T extends string> = {
  options: Option<T>[];
  selected: T;
  onSelect: (value: T) => void;
  fg: string;
  bg: string;
};

export function SegmentedControl<T extends string>({ options, selected, onSelect, fg, bg }: Props<T>) {
  return (
    <View style={[styles.container, { borderColor: fg + '33', backgroundColor: fg + '0A' }]}>
      {options.map((opt, i) => {
        const active = opt.value === selected;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.option,
              active && { backgroundColor: fg },
              i < options.length - 1 && { borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: fg + '22' },
            ]}
            onPress={() => onSelect(opt.value)}
            activeOpacity={0.7}
          >
            <Text style={[styles.label, { color: active ? bg : fg + 'AA' }]}>{opt.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    overflow: 'hidden',
  },
  option: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
});
