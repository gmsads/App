import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  Linking 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ContactAdmin: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [subject, setSubject] = useState<string>('');

  const handleSendMessage = (): void => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Error', 'Please fill in both subject and message');
      return;
    }

    const email = 'admin@example.com';
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    
    Linking.openURL(mailtoLink)
      .then(() => {
        Alert.alert('Success', 'Message sent successfully');
        setSubject('');
        setMessage('');
      })
      .catch(() => {
        Alert.alert('Error', 'Failed to open email client');
      });
  };

  const contactMethods = [
    {
      title: 'Email',
      value: 'admin@example.com',
      icon: 'email',
      onPress: () => Linking.openURL('mailto:admin@example.com')
    },
    {
      title: 'Phone',
      value: '+1 234 567 8900',
      icon: 'phone',
      onPress: () => Linking.openURL('tel:+12345678900')
    },
    {
      title: 'WhatsApp',
      value: '+1 234 567 8900',
      icon: 'whatsapp',
      onPress: () => Linking.openURL('https://wa.me/12345678900')
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contact Admin</Text>
        <Text style={styles.headerSubtitle}>Get in touch with our support team</Text>
      </View>

      <View style={styles.contactMethods}>
        {contactMethods.map((method, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.contactCard}
            onPress={method.onPress}
            activeOpacity={0.7}
          >
            <MaterialIcons name={method.icon as any} size={28} color="#4CAF50" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>{method.title}</Text>
              <Text style={styles.contactValue}>{method.value}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Send a Message</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Subject</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter subject"
            value={subject}
            onChangeText={setSubject}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Message</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Type your message here..."
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity 
          style={styles.sendButton} 
          onPress={handleSendMessage}
          activeOpacity={0.8}
        >
          <Text style={styles.sendButtonText}>Send Message</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  contactMethods: {
    padding: 20,
  },
  contactCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactInfo: {
    marginLeft: 16,
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 14,
    color: '#666',
  },
  formContainer: {
    padding: 20,
    paddingTop: 0,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ContactAdmin;