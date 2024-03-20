import * as React from "react";
import { SafeAreaView, TextInput, TouchableOpacity, Text, View, Image, StyleSheet, Pressable } from 'react-native';
import { useSignUp, useUser } from "@clerk/clerk-expo";
import styles from './SignUpCreateAccountStyle';

 
// export default function SignUpCreateAccount() {
  const SignUpCreateAccount = ({ navigation }) => {
  const { isLoaded, signUp, setActive } = useSignUp();
 
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const {user} = useUser();
  const [appUserInfo, setAppUserInfo] = React.useState({ //might need to change name of these json variables
    userId: '',
    email: '',
    firstName: '',
    lastName: ''
  })
 
  // start the sign up process.
  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }
 
    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress,
        password,
      });
 
      // send the email.
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
 
      // change the UI to our pending section.
      setPendingVerification(true);
    } catch (err) {
      // console.error(JSON.stringify(err, null, 2));
      alert(err.errors[0].longMessage);
    }
  };
 
  // This verifies the user using email code that is delivered.
  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }
 
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      await setActive({ session: completeSignUp.createdSessionId });

      // setAppUserInfo({
      //   userId: user.id,
      //   email: emailAddress,
      //   firstName: firstName,
      //   lastName: lastName
      // })

      // console.log(appUserInfo);

    //   await axios.post("http://localhost/app-user", appUserInfo,     
    //   // await axios.post("https://easybites-portal.azurewebsites.net/app-user",
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       }
    //     } 
    //   )
    //   .then(response => {
    //     if(response.status==200){
    //       console.log('User added successfully!');
    //     }
    //     else {
    //       console.error(
    //         'Failed to add user: ',
    //         response.status,
    //         response.statusText
    //       );
    //     }
    //   })
    } catch (err) {
      alert(err.errors[0].longMessage);
    }

    console.log("hello");
    console.log(user?.id);
  };
 
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/EBicon.png')} style={styles.logo} />
      </View>
      {!pendingVerification && (
        <View style={styles.formContainer}>
          <Text style={styles.title}>Welcome</Text>
        <View>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              value={firstName}
              placeholder="First Name"
              onChangeText={(firstName) => setFirstName(firstName)}
            />
          </View>
          <View>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              value={lastName}
              placeholder="Last Name"
              onChangeText={(lastName) => setLastName(lastName)}
            />
          </View>
          <View>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Email"
              onChangeText={(email) => setEmailAddress(email)}
            />
          </View>
 
          <View>
            <TextInput
              style={styles.input}
              value={password}
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
            />
          </View>
 
          <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
            <Text style={styles.buttonText}>Create account</Text>
          </TouchableOpacity>

          <Pressable
            style={styles.haveAnAccountContainer}
            onPress={() => navigation.navigate("LoginPage")} >
            <Text style={styles.haveAnAccount}>
              <Text>{`Have an account? `}</Text>
              <Text style={styles.login}>Login</Text>
            </Text>
          </Pressable>

        </View>
      )}
      {pendingVerification && (
        <View style={styles.formContainer}>
          <Text style={styles.title}>Verify Account</Text>
          <View>
            <TextInput
            style={styles.input}
              value={code}
              placeholder="Enter verification code"
              onChangeText={(code) => setCode(code)}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={onPressVerify}>
            <Text style={styles.buttonText}>Verify Email</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

export default SignUpCreateAccount;
