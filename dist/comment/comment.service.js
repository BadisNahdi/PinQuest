"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const comment_entity_1 = require("./entities/comment.entity");
const user_entity_1 = require("../user/entities/user.entity");
const post_entity_1 = require("../post/entities/post.entity");
let CommentService = class CommentService {
    constructor(commentRepository, userRepository, postRepository) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }
    async create(createCommentDto) {
        const user = await this.userRepository.findOneBy({
            id: createCommentDto.userId,
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${createCommentDto.userId} not found`);
        }
        const post = await this.postRepository.findOneBy({
            id: createCommentDto.postId,
        });
        if (!post) {
            throw new common_1.NotFoundException(`Post with ID ${createCommentDto.postId} not found`);
        }
        const comment = this.commentRepository.create({
            content: createCommentDto.content,
            user: user,
            post: post,
        });
        console.log(createCommentDto.content);
        return await this.commentRepository.save(comment);
    }
    async update(id, updateCommentDto) {
        const comment = await this.commentRepository.findOneBy({ id });
        if (!comment) {
            throw new common_1.NotFoundException(`Comment with ID ${id} not found`);
        }
        console.log(updateCommentDto.content);
        comment.content = updateCommentDto.content;
        return await this.commentRepository.save(comment);
    }
};
exports.CommentService = CommentService;
exports.CommentService = CommentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CommentService);
//# sourceMappingURL=comment.service.js.map