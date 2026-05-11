package com.mobiledev.SEdu.shared.config;

import com.mobiledev.SEdu.assessment.model.Question;
import com.mobiledev.SEdu.assessment.repository.QuestionRepository;
import com.mobiledev.SEdu.learning.model.Language;
import com.mobiledev.SEdu.learning.model.Topic;
import com.mobiledev.SEdu.learning.model.Vocabulary;
import com.mobiledev.SEdu.learning.repository.LanguageRepository;
import com.mobiledev.SEdu.learning.repository.TopicRepository;
import com.mobiledev.SEdu.learning.repository.VocabularyRepository;
import com.mobiledev.SEdu.subscription.model.Subscription;
import com.mobiledev.SEdu.subscription.model.SubscriptionPlan;
import com.mobiledev.SEdu.subscription.model.PaymentMethod;
import com.mobiledev.SEdu.subscription.repository.SubscriptionRepository;
import com.mobiledev.SEdu.auth.model.User;
import com.mobiledev.SEdu.auth.model.Role;
import com.mobiledev.SEdu.auth.model.AuthProvider;
import com.mobiledev.SEdu.auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Component
public class DataSeeder implements CommandLineRunner {

    private final LanguageRepository languageRepository;
    private final TopicRepository topicRepository;
    private final VocabularyRepository vocabularyRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public DataSeeder(LanguageRepository languageRepository, TopicRepository topicRepository,
                      VocabularyRepository vocabularyRepository, QuestionRepository questionRepository,
                      UserRepository userRepository, SubscriptionRepository subscriptionRepository,
                      org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.languageRepository = languageRepository;
        this.topicRepository = topicRepository;
        this.vocabularyRepository = vocabularyRepository;
        this.questionRepository = questionRepository;
        this.userRepository = userRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("====== STARTING DATA SEEDER ======");
        seedSafely(this::seedBaseCatalog, "base catalog");
        seedSafely(this::seedExtraEnglishPremiumTopics, "extra premium English topics");
        seedSafely(this::seedJapaneseFreeTopics, "free Japanese topics");
        seedSafely(this::seedDemoUsersAndSubscriptions, "demo users and subscriptions");
    }

    private void seedSafely(Runnable seeder, String label) {
        try {
            seeder.run();
        } catch (Exception e) {
            System.err.println("====== DATA SEEDER ERROR ======");
            System.err.println("ERROR: Failed while seeding " + label + ".");
            System.err.println("Message: " + e.getMessage());
            System.err.println("The backend will continue running without that seed step.");
            System.err.println("==================================");
        }
    }

            private void seedBaseCatalog() {
            if (languageRepository.count() != 0) {
                System.out.println("Database already contains catalog data. Skipping base catalog seed.");
                return;
            }

            System.out.println("Database is empty. Populating with comprehensive Mockup Data...");

            // --- Languages ---
            Language en = languageRepository.save(new Language("en", "English"));
            Language cn = languageRepository.save(new Language("cn", "Chinese"));
            Language jp = languageRepository.save(new Language("jp", "Japanese"));

            // --- English Topics & Data ---
            // Topic: Animals (Free)
            Topic animals = topicRepository.save(new Topic(en.getId(), "Animals", false));
            vocabularyRepository.save(new Vocabulary(animals.getId(), "Cat", "Con mèo", "n", "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba", null));
            vocabularyRepository.save(new Vocabulary(animals.getId(), "Dog", "Con chó", "n", "https://images.unsplash.com/photo-1517841905240-472988babdf9", null));
            vocabularyRepository.save(new Vocabulary(animals.getId(), "Elephant", "Con voi", "n", "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46", null));
            vocabularyRepository.save(new Vocabulary(animals.getId(), "Lion", "Sư tử", "n", "https://images.unsplash.com/photo-1546182990-dffeafbe841d", null));
            vocabularyRepository.save(new Vocabulary(animals.getId(), "Monkey", "Con khỉ", "n", "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9", null));
            vocabularyRepository.save(new Vocabulary(animals.getId(), "Tiger", "Con hổ", "n", null, null));
            vocabularyRepository.save(new Vocabulary(animals.getId(), "Giraffe", "Hươu cao cổ", "n", null, null));

            questionRepository.save(new Question(animals.getId(), "What is 'Cat' in Vietnamese?",
                Arrays.asList("Mèo", "Chó", "Cá", "Lợn"), 0, null));
            questionRepository.save(new Question(animals.getId(), "Which animal is 'Dog'?",
                Arrays.asList("Cat", "Dog", "Fish", "Pig"), 1, null));

            // Topic: Family (Free)
            Topic family = topicRepository.save(new Topic(en.getId(), "Family", false));
            vocabularyRepository.save(new Vocabulary(family.getId(), "Father", "Bố", "n", null, null));
            vocabularyRepository.save(new Vocabulary(family.getId(), "Mother", "Mẹ", "n", null, null));
            vocabularyRepository.save(new Vocabulary(family.getId(), "Brother", "Anh/Em trai", "n", null, null));
            vocabularyRepository.save(new Vocabulary(family.getId(), "Sister", "Chị/Em gái", "n", null, null));
            vocabularyRepository.save(new Vocabulary(family.getId(), "Grandfather", "Ông", "n", null, null));
            vocabularyRepository.save(new Vocabulary(family.getId(), "Grandmother", "Bà", "n", null, null));

            questionRepository.save(new Question(family.getId(), "Who is your 'Father'?",
                Arrays.asList("Mẹ", "Bố", "Anh trai", "Chị gái"), 1, null));

            // Topic: Food (Free)
            Topic food = topicRepository.save(new Topic(en.getId(), "Food", false));
            vocabularyRepository.save(new Vocabulary(food.getId(), "Bread", "Bánh mì", "n", null, null));
            vocabularyRepository.save(new Vocabulary(food.getId(), "Milk", "Sữa", "n", null, null));
            vocabularyRepository.save(new Vocabulary(food.getId(), "Rice", "Cơm", "n", null, null));

            // --- Chinese Topics & Data ---
            // Topic: Greetings (Free)
            Topic cnGreetings = topicRepository.save(new Topic(cn.getId(), "Greetings (问候)", false));
            vocabularyRepository.save(new Vocabulary(cnGreetings.getId(), "Nǐ hǎo", "Xin chào", "v", null, null));
            vocabularyRepository.save(new Vocabulary(cnGreetings.getId(), "Xièxiè", "Cảm ơn", "v", null, null));
            vocabularyRepository.save(new Vocabulary(cnGreetings.getId(), "Zàijiàn", "Tạm biệt", "v", null, null));

            questionRepository.save(new Question(cnGreetings.getId(), "'Nǐ hǎo' means?",
                Arrays.asList("Cảm ơn", "Xin chào", "Tạm biệt", "Xin lỗi"), 1, null));

            // Topic: Numbers (Premium)
            Topic cnNumbers = topicRepository.save(new Topic(cn.getId(), "Numbers (数字)", true));
            vocabularyRepository.save(new Vocabulary(cnNumbers.getId(), "Yī", "Một", "n", null, null));
            vocabularyRepository.save(new Vocabulary(cnNumbers.getId(), "Èr", "Hai", "n", null, null));
            vocabularyRepository.save(new Vocabulary(cnNumbers.getId(), "Sān", "Ba", "n", null, null));
            vocabularyRepository.save(new Vocabulary(cnNumbers.getId(), "Sì", "Bốn", "n", null, null));
            vocabularyRepository.save(new Vocabulary(cnNumbers.getId(), "Wǔ", "Năm", "n", null, null));

            // --- Japanese Topics & Data ---
            // Topic: Basic Phrases (Premium)
            Topic jpPhrases = topicRepository.save(new Topic(jp.getId(), "Basic Phrases (基本フレーズ)", true));
            vocabularyRepository.save(new Vocabulary(jpPhrases.getId(), "Konnichiwa", "Xin chào", "v", null, null));
            vocabularyRepository.save(new Vocabulary(jpPhrases.getId(), "Arigatou", "Cảm ơn", "v", null, null));
            vocabularyRepository.save(new Vocabulary(jpPhrases.getId(), "Sayounara", "Tạm biệt", "v", null, null));

            questionRepository.save(new Question(jpPhrases.getId(), "How do you say 'Thank you' in Japanese?",
                Arrays.asList("Konnichiwa", "Arigatou", "Sayounara", "Sumimasen"), 1, null));

            System.out.println("Comprehensive Mockup Data successfully seeded!");
            }

            private void seedExtraEnglishPremiumTopics() {
            Optional<Language> english = languageRepository.findByCode("en");
            if (english.isEmpty()) {
                return;
            }

            Language en = english.get();
            ensurePremiumTopic(
                en,
                "Travel & Transportation",
                new String[][] {
                    {"Airport", "Sân bay", "n", null},
                    {"Ticket", "Vé", "n", null},
                    {"Passport", "Hộ chiếu", "n", null},
                    {"Train", "Tàu hỏa", "n", null}
                },
                "Which word means 'passport' in Vietnamese?",
                List.of("Vé", "Hộ chiếu", "Sân bay", "Tàu hỏa"),
                1
            );

            ensurePremiumTopic(
                en,
                "Workplace English",
                new String[][] {
                    {"Meeting", "Cuộc họp", "n", null},
                    {"Deadline", "Hạn chót", "n", null},
                    {"Report", "Báo cáo", "n", null},
                    {"Project", "Dự án", "n", null}
                },
                "What is a 'deadline'?",
                List.of("A work report", "A due date", "A meeting", "A project"),
                1
            );

            ensurePremiumTopic(
                en,
                "Grammar Essentials",
                new String[][] {
                    {"Tense", "Thì", "n", null},
                    {"Verb", "Động từ", "n", null},
                    {"Noun", "Danh từ", "n", null},
                    {"Adjective", "Tính từ", "n", null}
                },
                "Which one is a verb?",
                List.of("House", "Run", "Happy", "Table"),
                1
            );
            }

    private void seedJapaneseFreeTopics() {
            Optional<Language> japanese = languageRepository.findByCode("jp");
            if (japanese.isEmpty()) {
                return;
            }

            Language jp = japanese.get();

            ensureFreeTopic(
                jp,
                "Greetings (あいさつ)",
                new String[][] {
                    {"Konnichiwa", "Xin chào", "v", null},
                    {"Ohayou", "Chào buổi sáng", "v", null},
                    {"Konbanwa", "Chào buổi tối", "v", null},
                    {"Arigatou", "Cảm ơn", "v", null}
                },
                "Which phrase means 'thank you' in Japanese?",
                List.of("Ohayou", "Arigatou", "Konbanwa", "Sayonara"),
                1
            );

            ensureFreeTopic(
                jp,
                "Numbers (数字)",
                new String[][] {
                    {"Ichi", "Một", "n", null},
                    {"Ni", "Hai", "n", null},
                    {"San", "Ba", "n", null},
                    {"Yon", "Bốn", "n", null},
                    {"Go", "Năm", "n", null}
                },
                "Which word means 'two' in Japanese?",
                List.of("Ichi", "Ni", "San", "Go"),
                1
            );

            ensureFreeTopic(
                jp,
                "Family (家族)",
                new String[][] {
                    {"Haha", "Mẹ", "n", null},
                    {"Chichi", "Bố", "n", null},
                    {"Ani", "Anh trai", "n", null},
                    {"Imouto", "Em gái", "n", null}
                },
                "Which word means 'father' in Japanese?",
                List.of("Haha", "Chichi", "Ani", "Imouto"),
                1
            );
    }

    private void seedDemoUsersAndSubscriptions() {
            ensureUser("admin", "admin@sedu.com", Role.ADMIN);
            ensureUser("normaluser", "normaluser@sedu.com", Role.USER);
            User premiumYearlyUser = ensureUser("user", "user@sedu.com", Role.USER);
            User premiumMonthlyUser = ensureUser("premium", "premium@sedu.com", Role.USER);

            ensureActiveSubscription(premiumYearlyUser, SubscriptionPlan.PREMIUM_YEARLY, PaymentMethod.PAYPAL);
            ensureActiveSubscription(premiumMonthlyUser, SubscriptionPlan.PREMIUM_MONTHLY, PaymentMethod.DEBIT_CARD);

        System.out.println("Demo users ensured: admin/admin123, normaluser/normaluser123, user/user123 (Premium), premium/premium123 (Premium)");
    }

    private User ensureUser(String username, String email, Role role) {
            return userRepository.findByUsername(username)
                .orElseGet(() -> userRepository.save(new User(
                    username,
                    email,
                    passwordEncoder.encode(username + "123"),
                    role,
                    AuthProvider.LOCAL
                )));
    }

    private void ensureActiveSubscription(User user, SubscriptionPlan plan, PaymentMethod paymentMethod) {
            if (subscriptionRepository.findByUserIdAndActiveTrue(user.getId()).isPresent()) {
                return;
            }

            java.time.Instant now = java.time.Instant.now();
            java.time.Instant endAt = plan == SubscriptionPlan.PREMIUM_MONTHLY
                ? now.plus(java.time.Duration.ofDays(30))
                : now.plus(java.time.Duration.ofDays(365));

            subscriptionRepository.save(new Subscription(
                user.getId(),
                plan,
                paymentMethod,
                "TXN-" + System.currentTimeMillis() + "-" + user.getUsername(),
                plan.getPriceVND(),
                now,
                endAt
            ));
    }

    private void ensurePremiumTopic(Language language, String topicName, String[][] vocabularySeeds, String questionContent, List<String> questionOptions, int correctOptionIndex) {
            Topic topic = topicRepository.findByLanguageIdAndName(language.getId(), topicName)
                .orElseGet(() -> topicRepository.save(new Topic(language.getId(), topicName, true)));

            for (String[] seed : vocabularySeeds) {
                String word = seed[0];
                boolean exists = vocabularyRepository.findByTopicId(topic.getId()).stream()
                    .anyMatch(vocabulary -> vocabulary.getWord().equalsIgnoreCase(word));
                if (!exists) {
                vocabularyRepository.save(new Vocabulary(topic.getId(), word, seed[1], seed[2], seed[3], null));
                }
            }

            boolean questionExists = questionRepository.findByTopicId(topic.getId()).stream()
                .anyMatch(existing -> existing.getContent().equalsIgnoreCase(questionContent));
            if (!questionExists) {
                questionRepository.save(new Question(topic.getId(), questionContent, questionOptions, correctOptionIndex, null));
            }
    }

    private void ensureFreeTopic(Language language, String topicName, String[][] vocabularySeeds, String questionContent, List<String> questionOptions, int correctOptionIndex) {
            Topic topic = topicRepository.findByLanguageIdAndName(language.getId(), topicName)
                .orElseGet(() -> topicRepository.save(new Topic(language.getId(), topicName, false)));

            for (String[] seed : vocabularySeeds) {
                String word = seed[0];
                boolean exists = vocabularyRepository.findByTopicId(topic.getId()).stream()
                    .anyMatch(vocabulary -> vocabulary.getWord().equalsIgnoreCase(word));
                if (!exists) {
                vocabularyRepository.save(new Vocabulary(topic.getId(), word, seed[1], seed[2], seed[3], null));
                }
            }

            boolean questionExists = questionRepository.findByTopicId(topic.getId()).stream()
                .anyMatch(existing -> existing.getContent().equalsIgnoreCase(questionContent));
            if (!questionExists) {
                questionRepository.save(new Question(topic.getId(), questionContent, questionOptions, correctOptionIndex, null));
            }
    }
}
