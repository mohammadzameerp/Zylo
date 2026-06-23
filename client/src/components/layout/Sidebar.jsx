import { NavLink } from 'react-router-dom';
import {
  RiHome5Line,
  RiHome5Fill,
  RiCompass3Line,
  RiCompass3Fill,
  RiBookmarkLine,
  RiBookmarkFill,
  RiUserLine,
  RiUserFill,
  RiHashtag,
  RiFireLine,
} from 'react-icons/ri';
import { useSelector } from 'react-redux';

const navItems = [
  { to: '/', label: 'Home', icon: RiHome5Line, activeIcon: RiHome5Fill },
  { to: '/explore', label: 'Explore', icon: RiCompass3Line, activeIcon: RiCompass3Fill },
  { to: '/profile', label: 'Profile', icon: RiUserLine, activeIcon: RiUserFill, auth: true },
];

const trendingTags = [
  'anonymous', 'confessions', 'thoughts', 'unpopular-opinion', 
  'daily', 'rant', 'advice', 'motivation', 'funny', 'serious',
];

const categories = [
  { name: 'General', color: 'text-blue-400' },
  { name: 'Confession', color: 'text-pink-400' },
  { name: 'Advice', color: 'text-green-400' },
  { name: 'Rant', color: 'text-red-400' },
  { name: 'Funny', color: 'text-yellow-400' },
  { name: 'Serious', color: 'text-purple-400' },
  { name: 'Question', color: 'text-cyan-400' },
];

export default function Sidebar() {
  const { user, token } = useSelector((state) => state.auth);

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-20 space-y-4">
        {/* Navigation */}
        <div className="glass rounded-2xl p-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              if (item.auth && !token) return null;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-accent/20 to-cyan/10 text-white border border-accent/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive ? (
                        <item.activeIcon className="w-5 h-5 text-accent" />
                      ) : (
                        <item.icon className="w-5 h-5" />
                      )}
                      {item.label}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Trending Tags */}
        <div className="glass rounded-2xl p-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
            <RiFireLine className="w-4 h-4 text-warning" />
            Trending Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {trendingTags.map((tag) => (
              <NavLink
                key={tag}
                to={`/?tag=${tag}`}
                className="px-3 py-1.5 text-xs font-medium text-gray-400 bg-white/5 rounded-full hover:bg-accent/10 hover:text-accent transition-all duration-300 border border-white/5 hover:border-accent/20"
              >
                <RiHashtag className="inline w-3 h-3 mr-0.5" />
                {tag}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="glass rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-white mb-3">Categories</h3>
          <div className="space-y-1">
            {categories.map((cat) => (
              <NavLink
                key={cat.name}
                to={`/?category=${cat.name.toLowerCase()}`}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300"
              >
                <span className={`w-2 h-2 rounded-full ${cat.color.replace('text-', 'bg-')}`} />
                {cat.name}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
