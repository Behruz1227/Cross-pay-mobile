import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Modal from "react-native-modal";
import Buttons from "../buttons/button";
import { ICenteredModalProps } from "@/types/modal/modal";

const { width, height } = Dimensions.get("window");

const CenteredModal: React.FC<ICenteredModalProps> = (props) => {
  const {
    children,
    btnWhiteText,
    btnRedText,
    isFullBtn,
    isModal,

    toggleModal,
    onConfirm,
    oneBtn,
  } = props;

  return (
    <View style={styles.container}>
      <Modal
        isVisible={isModal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropColor="black"
        coverScreen={true}
        deviceHeight={height}
        deviceWidth={width}
        hasBackdrop={true}
        hideModalContentWhileAnimating={true}
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
        useNativeDriver={true}
      >
        <View style={styles.modalView}>
          {children}
          {oneBtn && <Buttons title={btnRedText} onPress={onConfirm} />}
          {!oneBtn && (
            <View
              style={[
                styles.buttonContainer,
                isFullBtn ? styles.flexRow : styles.flexColumn,
              ]}
            >
              <View
                style={[
                  isFullBtn ? styles.fullWidthHalf : styles.marginVertical,
                ]}
              >
                <Buttons
                  backgroundColor={"#FF5A3A"}
                  title={btnRedText}
                  textColor={"white"}
                  onPress={isFullBtn ? toggleModal : onConfirm}
                />
              </View>
              <View
                style={[
                  isFullBtn ? styles.fullWidthHalf : styles.marginVertical,
                  isFullBtn && styles.marginHorizontal,
                ]}
              >
                <Buttons
                  backgroundColor={"#e8e8e8"}
                  title={btnWhiteText}
                  textColor={"#FF5A3A"}
                  onPress={isFullBtn ? onConfirm : toggleModal}
                />
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "#f8f9fa",
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 10,
  },
  flexRow: {
    flexDirection: "row",
  },
  flexColumn: {
    flexDirection: "column",
  },
  buttonWrapper: {
    flex: 1,
  },
  fullWidthHalf: {
    width: "48%",
  },
  marginVertical: {
    marginVertical: 6,
  },
  marginHorizontal: {
    marginHorizontal: 6,
  },
});

export default CenteredModal;
