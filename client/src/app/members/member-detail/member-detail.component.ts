import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { MessageService } from 'src/app/_services/message.service';
import { PrecenseService } from 'src/app/_services/precense.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {

  public member:Member;

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  @ViewChild("memberTabs", {static: true}) memberTabs: TabsetComponent;
  activeTab: TabDirective; 
  messages: Message[] = [];
  user: User;

  constructor(private memberService:MembersService, 
              private activatedRoute: ActivatedRoute, 
              private messageService: MessageService,
              public precense: PrecenseService,
              private accountService: AccountService,
              private router: Router ) {
    this.accountService.currentUser$.pipe( take(1) ).subscribe( user => { 
      this.user = user;
    });

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  ngOnInit(): void {

    this.activatedRoute.data.subscribe( data => { 
      this.member = data.member;
    });

    this.activatedRoute.queryParams.subscribe(params => {
       console.log(params.tab);
       params.tab ? this.selectTab(params.tab) : this.selectTab(0);
    });

    
    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      },
    ];

    this.galleryImages = this.getImages();
    
  }

  getImages(): NgxGalleryImage[] {
    const imagesUrl = [];

    for (const photo of this.member.photos) {
       imagesUrl.push({
         small: photo?.url,
         medium: photo?.url,
         big: photo?.url, 
       });
    }

    return imagesUrl;

  }

  loadMessages() {
    this.messageService.getMessageThread(this.member.username).subscribe( response => { 
        this.messages = response;
    });
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === "Messages" && this.messages) {
       /* this.loadMessages(); */
       this.messageService.createHubConnection( this.user, this.member.username );
    } else {
      this.messageService.stopHubConnection();
    }
  }

  selectTab(tabId: number) {
     this.memberTabs.tabs[tabId].active = true;
  }

}
