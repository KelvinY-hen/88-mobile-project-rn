import React from "react";
import { TouchableOpacity, StyleSheet, Image } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { ThemedFA6 } from "../ThemedFA6";
import { ThemedInput } from "../ThemedInput";
import { RadioButton } from "react-native-paper";

type RADIO_OBJECT_TYPE = {
  id: string;
  label: string;
  value: string;
}

type ThemedRowProps = {
  id?: string;
  index?: number;
  type: string;
  label: string;
  icon?: string;
  link?: string;
  handleFunction?: () => void;
  optional?: string;
  form?: object;
  data?: Array<RADIO_OBJECT_TYPE>;
  logout?: () => void;
  stateValue:string;
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
  handleFunction,
  data,
  stateValue,
  style,
  ...otherProps
}) => {
  const router = useRouter();

  const inputType = type == "input";
  const inputPotrait = type == "potrait";
  const inputRadio = type == "radio";

  if (inputPotrait) {
    console.log("miaw", optional);
  }

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
          } else if (
            type === "select" ||
            (type === "potrait" && handleFunction)
          ) {
            handleFunction();
          }
        }}
      >
        <ThemedView style={styles.row}>
          <ThemedView
            style={[styles.rowHeader, inputType ? { flex: 0.75 } : {}]}
          >
            {icon && (
              <ThemedFA6 name={icon} size={20} style={{ marginRight: 32 }} />
            )}

            <ThemedText style={styles.rowLabel}>{label}</ThemedText>
          </ThemedView>

          <ThemedView
            style={[styles.rowContent, inputType ? { flex: 1.25 } : {}]}
          >
            {inputType && (
              <ThemedInput
                maxLength={20}
                style={[styles.rowLabel, { textAlign: "right" }]}
                placeholder={optional}
              ></ThemedInput>
            )}
            {inputPotrait &&
              (!optional ? (
                <ThemedFA6
                  name={"user"}
                  size={20}
                  style={{ marginRight: 10 }}
                />
              ) : (
                <Image
                  source={{ uri: optional }}
                  accessibilityLabel="potrait"
                  style={{
                    width: 30,
                    height: 30,
                    marginRight: 10,
                    borderRadius: 50,
                  }}
                ></Image>
              ))}
            {inputRadio && (
              <ThemedView
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {data && data.map(({id, label, value}) => (
                  <ThemedView
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    
                  }}
                  key={id}
                >
                  <ThemedText style={{ paddingBottom: 2 }}>{label}</ThemedText>
                  <RadioButton value={value} status={stateValue ==  value ? 'checked' : 'unchecked'} onPress={() => handleFunction(value)}/>
                </ThemedView>
                ))}
              </ThemedView>
            )}
            {optional && !inputType && !inputPotrait && !inputRadio && (
              <ThemedText style={styles.rowLabel}>{optional} </ThemedText>
            )}
            {["select", "link", "potrait"].includes(type) && (
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
    justifyContent: "flex-start",
  },
  rowContent: {
    // flex:1.25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
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
