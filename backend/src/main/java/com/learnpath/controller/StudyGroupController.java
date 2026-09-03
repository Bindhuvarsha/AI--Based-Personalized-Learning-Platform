package com.learnpath.controller;

import com.learnpath.dto.StudyGroupDtos.*;
import com.learnpath.model.entity.User;
import com.learnpath.service.StudyGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/study-groups")
@RequiredArgsConstructor
public class StudyGroupController {

    private final StudyGroupService studyGroupService;

    @GetMapping
    public ResponseEntity<List<StudyGroupDto>> listGroups(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(studyGroupService.listGroups(user));
    }

    @PostMapping
    public ResponseEntity<StudyGroupDto> createGroup(@AuthenticationPrincipal User user,
                                                    @RequestBody CreateStudyGroupRequest request) {
        return ResponseEntity.ok(studyGroupService.createGroup(user, request));
    }

    @PostMapping("/{groupId}/join")
    public ResponseEntity<Void> joinGroup(@AuthenticationPrincipal User user,
                                          @PathVariable Long groupId) {
        studyGroupService.joinGroup(user, groupId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{groupId}/leave")
    public ResponseEntity<Void> leaveGroup(@AuthenticationPrincipal User user,
                                           @PathVariable Long groupId) {
        studyGroupService.leaveGroup(user, groupId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{groupId}/messages")
    public ResponseEntity<List<GroupMessageDto>> getMessages(@AuthenticationPrincipal User user,
                                                            @PathVariable Long groupId) {
        return ResponseEntity.ok(studyGroupService.getMessages(user, groupId));
    }

    @PostMapping("/{groupId}/messages")
    public ResponseEntity<GroupMessageDto> postMessage(@AuthenticationPrincipal User user,
                                                      @PathVariable Long groupId,
                                                      @RequestBody PostMessageRequest request) {
        return ResponseEntity.ok(studyGroupService.postMessage(user, groupId, request));
    }
}
