package com.bcb.backend.mysql.model;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "temporary_registration")
public class TemporaryRegistration {
    
    @EmbeddedId
    private TemporaryRegistrationId id;
    
    @MapsId("temporaryRecruitmentId")
    @ManyToOne
    @JoinColumn(name = "temporary_recruitment_id")
    private TemporaryRecruitment temporaryRecruitment;

    @MapsId("playerId")
    @ManyToOne
    @JoinColumn(name = "player_id")
    private Player player;

}
