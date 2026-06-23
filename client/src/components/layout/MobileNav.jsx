import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  RiHome5Line,
  RiHome5Fill,
  RiCompass3Line,
  RiCompass3Fill,
  RiAddCircleLine,
  RiAddCircleFill,
  RiNotification3Line,
  RiNotification3Fill,
  RiUserLine,
  RiUserFill,
} from 'react-icons/ri';

export default function MobileNav() {
  const { token } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notifications);

  const tabs = token
    ? [
        { to: '/', icon: RiHome5Line, activeIcon: RiHome5Fill, label: 'Home' },
        { to: '/explore', icon: RiCompass3Line, activeIcon: RiCompass3Fill, label: 'Explore' },
        { to: '/create', icon: RiAddCircleLine, activeIcon: RiAddCircleFill, label: 'Create', isCreate: true },
        { to: '/notifications', icon: RiNotification3Line, activeIcon: RiNotification3Fill, label: 'Alerts', badge: unreadCount },
        { to: '/profile', icon: RiUserLine, activeIcon: RiUserFill, label: 'Profile' },
      ]
    : [
        { to: '/', icon: RiHome5Line, activeIcon: RiHome5Fill, label: 'Home' },
        { to: '/explore', icon: RiCompass3Line, activeIcon: RiCompass3Fill, label: 'Explore' },
        { to: '/login', icon: RiUserLine, activeIcon: RiUserFill, label: 'Login' },
      ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-dark-500/90 backdrop-blur-xl border-t border-white/5 pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/'}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center gap-0.5 w-14 h-14 rounded-2xl transition-all duration-300 ${
                tab.isCreate
                  ? 'bg-gradient-to-r from-accent to-cyan text-white rounded-xl scale-90 hover:scale-95'
                  : isActive
                  ? 'text-accent'
                  : 'text-gray-500 hover:text-gray-300'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && !tab.isCreate ? (
                  <tab.activeIcon className="w-6 h-6" />
                ) : (
                  <tab.icon className={`w-6 h-6 ${tab.isCreate ? 'w-7 h-7' : ''}`} />
                )}
                <span className={`text-[10px] font-medium ${tab.isCreate ? 'text-white' : ''}`}>
                  {tab.label}
                </span>
                {tab.badge > 0 && (
                  <span className="absolute -top-0.5 right-1 min-w-[16px] h-4 px-1 text-[10px] font-bold text-white bg-danger rounded-full flex items-center justify-center">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}
                {isActive && !tab.isCreate && (
                  <span className="absolute -bottom-0.5 w-4 h-0.5 rounded-full bg-accent" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
