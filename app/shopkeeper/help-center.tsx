import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const HelpCenter: React.FC = () => {
  const faqs = [
    {
      question: 'How do I add a new product?',
      answer: 'Go to Products > Add Product and fill in the required details including product name, category, price, and quantity types.',
    },
    {
      question: 'How can I update my shop information?',
      answer: 'Navigate to Profile > Update Profile and submit a request to update your shop details.',
    },
    {
      question: 'How do I view my sales reports?',
      answer: 'Go to Reports > Sales Report to view detailed sales analytics and reports.',
    },
    {
      question: 'How to manage delivery settings?',
      answer: 'Access Delivery Settings from the Settings menu to configure delivery radius, charges, and minimum order amount.',
    },
    {
      question: 'What should I do if I forget my password?',
      answer: 'Contact the admin team through the Support section to reset your password.',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Frequently Asked Questions</Text>
        <Text style={styles.headerSubtitle}>Find answers to common questions</Text>
      </View>

      <View style={styles.content}>
        {faqs.map((faq, index) => (
          <View key={index} style={styles.faqItem}>
            <Text style={styles.question}>Q: {faq.question}</Text>
            <Text style={styles.answer}>A: {faq.answer}</Text>
          </View>
        ))}
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
  content: {
    padding: 20,
  },
  faqItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  answer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default HelpCenter;