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
exports.PostService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const post_entity_1 = require("./entities/post.entity");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../User/entities/user.entity");
const category_service_1 = require("../category/category.service");
let PostService = class PostService {
    constructor(repo, catService, userRepo) {
        this.repo = repo;
        this.catService = catService;
        this.userRepo = userRepo;
    }
    async create(createPostDto, user) {
        const post = new post_entity_1.Post();
        post.userId = user.id;
        Object.assign(post, createPostDto);
        this.repo.create(post);
        return await this.repo.save(post);
    }
    async findAll(query) {
        const myQuery = this.repo
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.category', 'category')
            .leftJoinAndSelect('post.user', 'user');
        if (!(Object.keys(query).length === 0) && query.constructor === Object) {
            const queryKeys = Object.keys(query);
            if (queryKeys.includes('slug')) {
                myQuery.where('post.slug LIKE :slug', { slug: `%${query['slug']}%` });
            }
            if (queryKeys.includes('sort')) {
                myQuery.orderBy('post.title', query['sort'].toUpperCase());
            }
            if (queryKeys.includes('category')) {
                myQuery.andWhere('category.title = :cat', { cat: query['category'] });
            }
            return await myQuery.getMany();
        }
        else {
            return await myQuery.getMany();
        }
    }
    async findWithBlocked(userId, query) {
        const allPosts = await this.findAll(query);
        let blockedUsers = await this.getUserBlockedUsers(userId);
        blockedUsers = blockedUsers.map(Number);
        const filteredPosts = allPosts.filter((post) => !blockedUsers.includes(post.user.id));
        return filteredPosts;
    }
    async findOne(id) {
        try {
            const post = await this.repo.findOneOrFail({ where: { id: id } });
            return post;
        }
        catch (err) {
            throw new common_1.BadRequestException('Post not found');
        }
    }
    async findBySlug(slug) {
        try {
            const post = await this.repo.findOneBy({ slug });
            return post;
        }
        catch (err) {
            throw new common_1.BadRequestException(`Post with slug ${slug} not found`);
        }
    }
    async update(slug, updatePostDto) {
        const post = await this.repo.findOneBy({ slug });
        if (!post) {
            throw new common_1.BadRequestException('post not found');
        }
        post.modifiedOn = new Date(Date.now());
        post.category = updatePostDto.category;
        Object.assign(post, updatePostDto);
        return this.repo.save(post);
    }
    async remove(id) {
        const post = await this.repo.findOneBy({ id });
        await this.repo.remove(post);
        return { success: true, post };
    }
    async searchPosts(hashtags, title) {
        const queryBuilder = this.repo.createQueryBuilder('post');
        if (title) {
            queryBuilder.where('post.title LIKE :title', { title: `%${title}%` });
        }
        if (hashtags && hashtags.length > 0) {
            hashtags.forEach((hashtag, index) => {
                const query = `FIND_IN_SET(:hashtag${index}, post.hashtags)`;
                if (index === 0 && !title) {
                    queryBuilder.where(query, { [`hashtag${index}`]: hashtag });
                }
                else {
                    queryBuilder.orWhere(query, { [`hashtag${index}`]: hashtag });
                }
            });
        }
        return await queryBuilder.getMany();
    }
    async getPostsForUser(userId, viewerId) {
        const blockedUsers = viewerId
            ? await this.getUserBlockedUsers(viewerId)
            : [];
        const query = this.repo
            .createQueryBuilder('post')
            .where('post.userId = :userId', { userId });
        if (blockedUsers.length > 0) {
            query.andWhere('post.userId NOT IN (:...blockedUsers)', { blockedUsers });
        }
        return query.getMany();
    }
    async getPostByShareToken(shareToken) {
        return this.repo.findOne({ where: { shareToken } });
    }
    async getUserBlockedUsers(userId) {
        const user = await this.userRepo.findOneBy({ id: userId });
        return user ? user.blockList || [] : [];
    }
};
exports.PostService = PostService;
exports.PostService = PostService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        category_service_1.CategoryService,
        typeorm_2.Repository])
], PostService);
//# sourceMappingURL=post.service.js.map