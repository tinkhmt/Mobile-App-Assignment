package com.mobiledev.SEdu.learning.repository;

import com.mobiledev.SEdu.learning.model.Topic;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TopicRepository extends MongoRepository<Topic, String> {
    List<Topic> findByLanguageId(String languageId);
    List<Topic> findByIsPremiumFalse();
    Optional<Topic> findByLanguageIdAndName(String languageId, String name);
}
