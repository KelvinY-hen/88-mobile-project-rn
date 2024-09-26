import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { ThemedFA6 } from "../ThemedFA6";
import { ThemedInput } from "../ThemedInput";

type ThemedRowProps = {
  id?: string;
  index?: number;
  type: string;
  label: string;
  icon?: string;
  link?: string;
  optional?: string;
  form?: object;
  logout?: () => void;
};

const ThemedRow: React.FC<ThemedRowProps> = ({
  id = null,
  index = null,
  type,
  label,
  icon,
  link = null,
  optional = null,
  form = {},
  logout,
  style,
  ...otherProps
}) => {
  const router = useRouter();

  const inputType = type == "input";

  return (
    <ThemedView
      style={[styles.rowWrapper, index === 0 && { borderTopWidth: 0 }, style]}
      key={id}
      {...otherProps}
    >
      <TouchableOpacity
        onPress={() => {
          if (type === "link" && link) {
            router.push(link);
          } else if (type === "logout" && logout) {
            logout();
          }
        }}
      >
        <ThemedView style={styles.row}>
          <ThemedView style={[styles.rowHeader, inputType ? { flex: 0.75 } : {}]}>
            {icon && (
              <ThemedFA6 name={icon} size={20} style={{ marginRight: 32 }} />
            )}

            <ThemedText style={styles.rowLabel}>{label}</ThemedText>
          </ThemedView>
          <ThemedView style={[styles.rowContent, inputType ? { flex: 1.25 } : {}]}>
            {inputType  && (
              <ThemedInput maxLength={20} style={[styles.rowLabel,{textAlign:'right'}]} placeholder={optional}></ThemedInput>
            )}
            {(optional && !inputType) && (
              <ThemedText style={styles.rowLabel}>{optional} </ThemedText>
            )}
            {["select", "link"].includes(type) && (
              <ThemedFA6 name={"chevron-right"} size={20} color="#ababab" />
            )}
          </ThemedView>
        </ThemedView>
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  rowWrapper: {
    borderTopWidth: 1,
    borderColor: "#e5e5e5",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowHeader: {
    // flex:0.75,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"flex-start"
  },
  rowContent: {
    // flex:1.25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"flex-end"
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  rowSpacer: {
    flex: 1,
  },
});

export default ThemedRow;
