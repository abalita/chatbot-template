
module.exports = {

    fb_token: process.env.FB_TOKEN,
    fb_verify_token: process.env.FB_VERIFY_TOKEN,
    fb_message_url: "https://graph.facebook.com/v2.6/me/messages",
    fb_thread_url: "https://graph.facebook.com/v2.6/me/thread_settings",
    fb_messenger_profile: "https://graph.facebook.com/v2.6/me/messenger_profile",
    fb_user_profile:"https://graph.facebook.com/v2.6/{#fb_sender_id}?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token={#fb_token}",
    fb_page_url:"https://graph.facebook.com/v2.11/",
    //whitelisted domains
    whitelisted_domains: [process.env.HOME_URL]
    //keywords    
};